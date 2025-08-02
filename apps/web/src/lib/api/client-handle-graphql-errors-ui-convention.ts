'use client'

import {GraphQLResponse} from '@/types/graphql';
import {
    classifyGraphQLErrors,
    extractErrorsString,
    graphQlResponseHasInstanceOf,
    hasGraphQlError
} from '@/lib/api/graphql-error-helpers';
import {BadRequestException, ForbiddenException, UnauthorizedException} from '@bunny/shared';
import { toast } from 'sonner';
import {authManager} from '@/lib/auth/auth-manager';
import * as Sentry from '@sentry/nextjs';

export function showErrorToast(
    message: string,
    options?: {
        description?: string;
        duration?: number;
    }
) {
    toast.error(message, {
        description: options?.description,
        duration: options?.duration ?? 5000,
        className: 'bg-red-50 border border-red-300 text-red-800',
        descriptionClassName: 'text-sm text-red-700',
        icon: '❌',
    });
}

export function clientHandleGraphqlErrorsUiConvention<T>(response: GraphQLResponse<T>): void {
    if (!hasGraphQlError(response)) return;
    const classifiedErrors = classifyGraphQLErrors(response);
    if (graphQlResponseHasInstanceOf(classifiedErrors, UnauthorizedException)) {
        authManager.triggerAuthFailure();
    } else if (graphQlResponseHasInstanceOf(classifiedErrors, ForbiddenException)) {
        // show403Page();
    } else if (graphQlResponseHasInstanceOf(classifiedErrors, BadRequestException)) {
    } else {
        for (const error of classifiedErrors) {
            Sentry.captureException(error);
        }
        showErrorToast(extractErrorsString(response));
    }
}