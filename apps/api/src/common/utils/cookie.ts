import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ms, StringValue } from '../../utils';

@Injectable()
export class CookieUtil {
  constructor(private readonly configService: ConfigService) {}

  setAuthCookies(res: Response, accessToken: string, refreshToken?: string): void {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    const accessMaxAge = ms(
      this.configService.get<StringValue>('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
    );

    const refreshMaxAge = ms(
      this.configService.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d'),
    );

    const domain = this.configService.get<string>('COOKIE_DOMAIN', '.bunny-farm.org');

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: accessMaxAge,
      domain: isProd ? domain : undefined,
    });

    if (refreshToken) {
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: refreshMaxAge,
        domain: isProd ? domain : undefined,
      });
    }
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
