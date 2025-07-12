import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
// import { Response } from 'express';
// import { AuthService } from '../auth.service';
// import { CookieService } from '../../core/cookie.service';

@Injectable()
export class OptionalGqlAuthGuard extends AuthGuard('jwt') {
  // constructor(
  //   private readonly authService: AuthService,
  //   private readonly cookieService: CookieService,
  // ) {
  //   super();
  // }

  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<CurrentJwtUser>(
    err: GraphQLError,
    user: CurrentJwtUser | null,
    info: any,
    // context: ExecutionContext,
  ): CurrentJwtUser | null {
    if (err) {
      // If a token parsing error occurs, but anonymous users are allowed, the log is printed and ignored
      console.warn('Optional auth error:', err);
      return null;
    }

    // Generally speaking, info is an error message provided by passport, such as the token expires, invalid, etc.
    if (!user && info?.name === 'TokenExpiredError') {
      console.warn('Token expired');
      return null;
    }

    if (!user && info) {
      console.warn('Auth info:', info);
      return null;
    }

    // Return to valid user, otherwise null
    return user ?? null;
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const ctx = GqlExecutionContext.create(context);
  //   const req = ctx.getContext().req as Request;
  //   const res = ctx.getContext().res as Response;
  //
  //   try {
  //     const result = await super.canActivate(context);
  //     return result as boolean;
  //   } catch (err: any) {
  //     if (err?.name === 'UnauthorizedException') {
  //       const refreshToken = req.cookies?.refresh_token;
  //       if (!refreshToken) return true;
  //
  //       const newTokens = await this.authService.refreshToken(refreshToken);
  //       if (!newTokens) return true;
  //
  //       this.cookieService.setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
  //
  //       const decoded = await this.authService.verifyAsync(newTokens.accessToken);
  //       req.user = { id: decoded.sub, email: decoded.email };
  //
  //       return true;
  //     }
  //
  //     // ignore other errors: allow anonymous
  //     return true;
  //   }
  // }
}
