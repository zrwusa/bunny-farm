// apps/api/src/core/cookie.service.ts

import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { TokenMeta } from '../auth/dto/token.output';

@Injectable()
export class CookieService {
  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken?: string,
    accessMeta?: TokenMeta,
    refreshMeta?: TokenMeta,
  ): void {
    if (accessMeta) {
      res.cookie('access_token', accessToken, {
        httpOnly: accessMeta.httpOnly,
        secure: accessMeta.secure,
        sameSite: accessMeta.sameSite,
        maxAge: accessMeta.maxAge * 1000,
        domain: accessMeta.domain || undefined,
      });
    }

    if (refreshToken && refreshMeta) {
      res.cookie('refresh_token', refreshToken, {
        httpOnly: refreshMeta.httpOnly,
        secure: refreshMeta.secure,
        sameSite: refreshMeta.sameSite,
        maxAge: refreshMeta.maxAge * 1000,
        domain: refreshMeta.domain || undefined,
      });
    }
  }

  clearAuthCookies(res: Response, options?: CookieOptions): void {
    res.clearCookie('access_token', options);
    res.clearCookie('refresh_token', options);
  }
}
