// apps/web/src/lib/apollo/links/error-link.ts
import { onError } from '@apollo/client/link/error';
import { fromPromise, Observable } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { toast } from 'sonner';
import { refreshTokens } from '@/lib/auth/client-auth';
import { authManager } from '@/lib/auth/auth-manager';

export const errorLink = onError(({ graphQLErrors, operation, forward, networkError }) => {
    let shouldRetry = false;

    if (graphQLErrors) {
        for (const error of graphQLErrors) {
            const code = error.extensions?.code;
            const message = error.message;

            if (code === 'UNAUTHENTICATED') {
                shouldRetry = true;
                continue;
            }

            if (code === 'FORBIDDEN') {
                // TODO Optional jump processing
                // router.push('/403');
                continue;
            }

            // For other types of errors (non-BadRequest), toast + report pops up
            if (code !== 'BAD_REQUEST') {
                toast.error(message, {
                    className: 'bg-red-50 border border-red-300 text-red-800',
                    descriptionClassName: 'text-sm text-red-700',
                    icon: '❌',
                });
                Sentry.captureException(error);
            }
        }
    }

    if (shouldRetry) {
        return fromPromise(refreshTokens().catch(() => {
            authManager.triggerAuthFailure();
            return null;
        })).flatMap((ok) => {
            if (!ok) {
                // Don't try again
                return new Observable(() => {});
            }
            // Retry the original request
            return forward(operation);
        });
    }

    if (networkError) {
        toast.error('Network error occurred');
        Sentry.captureException(networkError);
    }
});

