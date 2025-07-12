// apps/api/src/auth/guards/gql-auth.guard.ts

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
// import { AuthService } from '../auth.service';
// import { CookieService } from '../../core/cookie.service';
// import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  // constructor(
  //   private readonly authService: AuthService,
  //   private readonly cookieService: CookieService,
  // ) {
  //   super();
  // }

  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req; // Key point: The req object that must be returned in GraphQL
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   console.log('---canActivate');
  //   const ctx = GqlExecutionContext.create(context);
  //   const req = ctx.getContext().req;
  //   const res = ctx.getContext().res;
  //
  //   try {
  //     const can = await super.canActivate(context);
  //     if (can) return true;
  //   } catch (err: any) {
  //     console.log('---err?.name', err?.name);
  //     if (err?.name === 'UnauthorizedException') {
  //       console.log('---req.cookies', req.cookies);
  //       const refreshToken = req.cookies?.refresh_token as string;
  //       if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
  //       console.log('---refreshToken', refreshToken);
  //       const newTokens = await this.authService.refreshToken(refreshToken);
  //       if (!newTokens) throw new UnauthorizedException('Invalid refresh token');
  //
  //       this.cookieService.setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
  //
  //       const decoded = await this.authService.verifyAsync(newTokens.accessToken);
  //
  //       req.user = { id: decoded.sub, email: decoded.email };
  //
  //       return true;
  //     }
  //
  //     throw err;
  //   }
  //
  //   return false;
  // }
}
