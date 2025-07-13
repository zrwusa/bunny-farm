// File: apps/api/src/auth/auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { GoogleOAuthService } from './google-oauth.service';
import { ms, StringValue } from '@bunny/shared';
import { TokenOutput, TokenMeta } from './dto/token.output';

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
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password) {
      const match = await bcrypt.compare(password, user.password);
      if (match) return user;
    }
    return null;
  }

  async validateOAuthUser(provider: string, oauthToken: string): Promise<User | null> {
    const googleUser = await this.googleOauthService.verifyIdToken(oauthToken);
    const { email, googleId, avatar: avatarUrl, name: displayName } = googleUser;
    if (!email) throw new BadRequestException('Email is required for OAuth login');

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

  async generateTokens(user: User): Promise<TokenOutput> {
    const payload = { sub: user.id, email: user.email };

    const accessConfig = this.config.get<StringValue>('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m');
    const accessMaxAge = ms(accessConfig) / 1000;
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: accessConfig,
    });

    const refreshConfig = this.config.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d');
    const refreshMaxAge = ms(refreshConfig) / 1000;
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: refreshConfig,
    });
    await this.redis.set(`refresh:${user.id}`, refreshToken, 'EX', refreshMaxAge);

    const meta: TokenMeta = {
      maxAge: accessMaxAge,
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: this.config.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      domain: this.config.get<string>('COOKIE_DOMAIN', ''),
    };
    const refreshMeta: TokenMeta = {
      maxAge: refreshMaxAge,
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: this.config.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
      domain: this.config.get<string>('COOKIE_DOMAIN', ''),
    };

    return {
      accessToken,
      refreshToken,
      accessTokenMeta: meta,
      refreshTokenMeta: refreshMeta,
    };
  }

  async refreshToken(token: string): Promise<TokenOutput | null> {
    try {
      const payload = await this.verifyAsync(token);
      const userId = payload.sub;

      const stored = await this.redis.get(`refresh:${userId}`);
      if (!stored || stored !== token) return null;

      const user = await this.userService.findById(userId);
      if (!user) return null;

      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
        return null;
      }
      throw err;
    }
  }

  async verifyAsync(token: string) {
    return this.jwtService.verifyAsync(token, { secret: this.config.get<string>('JWT_SECRET') });
  }

  async logout(userId: string): Promise<void> {
    await this.redis.del(`refresh:${userId}`);
  }
}
