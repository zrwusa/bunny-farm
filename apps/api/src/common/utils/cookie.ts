import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ms, StringValue } from '../../utils';

@Injectable()
export class CookieUtil {
  constructor(private readonly configService: ConfigService) {}

  setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    console.debug(`---isProd`, isProd)

    const accessMaxAge = ms(
      this.configService.get<StringValue>('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
    );

    const refreshMaxAge = ms(
      this.configService.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d'),
    );
    console.debug('accessMaxAge', accessMaxAge); // Should output 900000 (15 minutes)
    console.debug('refreshMaxAge', refreshMaxAge); // Should output 604800000 (7 days)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: accessMaxAge,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: refreshMaxAge,
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
