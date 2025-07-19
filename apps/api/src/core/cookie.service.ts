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
      res.cookie('ACCESS_TOKEN', accessToken, {
        httpOnly: accessMeta.httpOnly,
        secure: accessMeta.secure,
        sameSite: accessMeta.sameSite,
        maxAge: accessMeta.maxAge * 1000,
        domain: accessMeta.domain || undefined,
      });
    }

    if (refreshToken && refreshMeta) {
      res.cookie('REFRESH_TOKEN', refreshToken, {
        httpOnly: refreshMeta.httpOnly,
        secure: refreshMeta.secure,
        sameSite: refreshMeta.sameSite,
        maxAge: refreshMeta.maxAge * 1000,
        domain: refreshMeta.domain || undefined,
      });
    }
  }

  clearAuthCookies(res: Response, options?: CookieOptions): void {
    res.clearCookie('ACCESS_TOKEN', options);
    res.clearCookie('REFRESH_TOKEN', options);
  }
}
