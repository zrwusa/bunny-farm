import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { GoogleOAuthService } from './google-oauth.service';
import { ms } from '@bunny/shared';

@Injectable()
export class AuthService {
  private redis: Redis;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private googleOauthService: GoogleOAuthService,
  ) {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      throw new Error('Missing REDIS_URL config');
    }

    this.redis = new Redis(redisUrl);

    // this.redis = new Redis({
    //   host: config.get('REDIS_HOST', 'localhost'),
    //   port: config.get('REDIS_PORT', 6379),
    //   password: config.get('REDIS_PASSWORD', undefined),
    // });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return user;
      }
    }
    // No more throwing 401 directly, return null
    return null;
  }

  async validateOAuthUser(provider: string, oauthToken: string): Promise<User | null> {
    const googleUser = await this.googleOauthService.verifyIdToken(oauthToken);
    const { email, googleId, avatar: avatarUrl, name: displayName } = googleUser;
    if (!email) {
      // It is more suitable to use BadRequest or custom exceptions here.
      throw new BadRequestException('Email is required for OAuth login');
    }
    let user = await this.userService.findByProviderId(provider, googleId);
    if (!user) {
      user = await this.userService.createOAuthUser({
        username: email,
        email,
        provider,
        providerId: googleId,
        profile: { avatarUrl, displayName },
      });
    }
    return user;
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
    });

    const JWT_REFRESH_TOKEN_EXPIRES_IN = this.config.get('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d');

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.redis.set(
      `refresh:${user.id}`,
      refreshToken,
      'EX',
      ms(JWT_REFRESH_TOKEN_EXPIRES_IN) / 1000,
    );
    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get('JWT_SECRET'),
      });

      const userId = payload.sub;
      const stored = await this.redis.get(`refresh:${userId}`);
      if (!stored || stored !== refreshToken) {
        console.debug('---!stored || stored !== refreshToken', !stored || stored !== refreshToken);
        return null;
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        return null;
      }
      // A new pair of tokens is generated every time it is refreshed to prevent the refreshToken from being stolen for a long time.
      return this.generateTokens(user);
    } catch (err: unknown) {
      if (err instanceof TokenExpiredError) {
        // TODO logger should be implemented
        // this.logger.warn('Refresh token expired');
      } else if (err instanceof JsonWebTokenError) {
        // this.logger.warn('Invalid refresh token');
      } else {
        // this.logger.error('Unexpected error during refresh token process', err);
      }

      return null;
    }
  }

  async logout(userId: string): Promise<void> {
    await this.redis.del(`refresh:${userId}`);
  }
}
