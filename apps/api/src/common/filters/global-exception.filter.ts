import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import * as Sentry from '@sentry/nestjs';
import { Request } from 'express';
import { NestContext } from '../../types/nest';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType() as NestContext;

    if (contextType === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const ctx = gqlHost.getContext<{ req: Request }>();
      const req = ctx?.req;

      Sentry.captureException(exception, {
        extra: {
          type: 'graphql',
          url: req?.url,
          body: req?.body,
          headers: req?.headers,
        },
        user: req?.user ?? undefined,
        tags: { context: 'graphql' },
      });

      throw exception; // 保持 GraphQL 行为
    }

    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();

    Sentry.captureException(exception, {
      extra: {
        type: 'http',
        url: req?.url,
        method: req?.method,
        body: req?.body,
        params: req?.params,
        query: req?.query,
        headers: req?.headers,
      },
      user: req?.user ?? undefined,
      tags: { context: 'http' },
    });

    // 继续抛出异常，交给 Nest 默认 ExceptionHandler 处理
    throw exception;
  }
}
