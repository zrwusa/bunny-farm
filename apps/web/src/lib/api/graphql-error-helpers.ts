// File: apps/web/src/lib/api/handle-graphql-errors.ts

import { GraphQLResponse } from '@/types/graphql';
import { GraphQLError } from 'graphql';
import {
    BadRequestException, ConflictException,
    ForbiddenException, GatewayTimeoutException,
    HttpException, HttpExceptionOptions, InternalServerErrorException,
    NotFoundException, ServiceUnavailableException,
    UnauthorizedException
} from '@bunny/shared';

export function hasGraphQlError<T>(response: GraphQLResponse<T>): boolean {
    return Array.isArray(response.errors) && response.errors.length > 0;
}

export function graphQlResponseHasInstanceOf(classifiedErrors: HttpException[], Class: new (...args: Array<string | HttpExceptionOptions | undefined>) => HttpException) {
    return classifiedErrors.filter(error => error instanceof Class).length > 0
}

function classifyGraphQLError(error: GraphQLError): HttpException {
    const code = error.extensions?.code;
    const message = error.message;

    switch (code) {
        case 'BAD_REQUEST':
            return new BadRequestException(message);
        case 'UNAUTHENTICATED':
            return new UnauthorizedException(message);
        case 'FORBIDDEN':
            return new ForbiddenException(message);
        case 'NOT_FOUND':
            return new NotFoundException(message);
        case 'CONFLICT':
            return new ConflictException(message);
        case 'SERVICE_UNAVAILABLE':
            return new ServiceUnavailableException(message);
        case 'GATEWAY_TIMEOUT':
            return new GatewayTimeoutException(message);
        case 'INTERNAL_SERVER_ERROR':
        default:
            return new InternalServerErrorException(message);
    }
}

export function classifyGraphQLErrors<T>(response: GraphQLResponse<T>): HttpException[] {
    if (!response.errors || response.errors.length === 0) return [];

    return response.errors.map(classifyGraphQLError);
}

export function extractErrorsString<T>(response: GraphQLResponse<T>) {
    if (!response.errors || response.errors.length === 0) return '';

    return response.errors
        .map((error) => {
            const messages = (error.extensions?.originalError as { message?: string[] })?.message ?? [];
            return messages.join(';');
        })
        .join(';');
}