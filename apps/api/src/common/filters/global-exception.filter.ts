import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import * as Sentry from '@sentry/nestjs';
import { Request, Response } from 'express';
import { NestContext } from '../../types/nest';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType() as NestContext;

    // GraphQL Request
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

      // Continue to throw, retain GraphQLError default behavior
      throw exception;
    }

    // HTTP Request
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : ((res as any).message ?? message);
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

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

    console.error(exception);

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
}
