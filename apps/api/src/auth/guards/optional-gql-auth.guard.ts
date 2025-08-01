import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GraphQLError } from 'graphql';

@Injectable()
export class OptionalGqlAuthGuard extends AuthGuard('jwt') {
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
}
