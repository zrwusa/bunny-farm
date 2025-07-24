import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';
import { NestContext } from '../../types/nest';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType() as NestContext;
    const isHttp = contextType === 'http';
    const isGraphQL = contextType === 'graphql';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      message = typeof response === 'string' ? response : ((response as any).message ?? message);
    }

    const context = isHttp
      ? this.captureHttpContext(host)
      : isGraphQL
        ? this.captureGraphQLContext(host)
        : {};

    Sentry.captureException(exception, {
      extra: {
        type: host.getType(),
        ...context,
      },
      user: context?.user,
      tags: {
        context: contextType,
      },
    });

    console.error(exception);

    const responseBody = {
      success: false,
      statusCode,
      message,
    };

    if (isHttp) {
      const res = host.switchToHttp().getResponse<Response>();
      res.status(statusCode).json(responseBody);
    } else if (isGraphQL) {
      // It is recommended to directly throw the standard Error (GraphQL will be converted to GraphQLError)
      throw Object.assign(new Error(typeof message === 'string' ? message : message.join(', ')), {
        statusCode,
        success: false,
      });
    }
  }

  private captureHttpContext(host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    return {
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      user: req.user ?? null,
    };
  }

  private captureGraphQLContext(host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const req = gqlHost.getContext()?.req;
    return req
      ? {
          url: req.url,
          method: req.method,
          body: req.body,
          headers: req.headers,
          user: req.user ?? null,
        }
      : {};
  }
}
