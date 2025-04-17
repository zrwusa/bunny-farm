import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { GoogleOAuthService } from './google-oauth.service';

@Injectable()
export class AuthService {
  private redis: Redis;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
    private googleOauthService: GoogleOAuthService,
  ) {
    this.redis = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get('REDIS_PORT', 6379),
      password: config.get('REDIS_PASSWORD', undefined),
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateOAuthUser(provider: string, oauthToken: string): Promise<User> {
    const googleUser = await this.googleOauthService.verifyIdToken(oauthToken);
    const { email, googleId, avatar: avatarUrl, name: displayName } = googleUser;
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

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d'),
    });

    await this.redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 3600);
    return { accessToken, refreshToken };
  }

  async refreshToken(
    userId: string,
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const stored = await this.redis.get(`refresh:${userId}`);
    if (!stored || stored !== token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.redis.del(`refresh:${userId}`);
  }
}
