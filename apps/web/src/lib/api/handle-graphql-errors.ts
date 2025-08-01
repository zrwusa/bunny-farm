// File: apps/web/src/lib/api/handle-graphql-errors.ts

import { AuthError } from '@/lib/errors';
import { GraphQLResponse } from '@/types/graphql';

/**
 * Handles GraphQL-level errors (response.errors).
 * - BAD_USER_INPUT & VALIDATION_FAILED are UI-handled (form validation)
 * - UNAUTHENTICATED & FORBIDDEN throw AuthError
 * - Other errors throw a generic Error
 *
 * @param response GraphQL response to check
 * @throws {AuthError|Error} for non-validation errors
 */
export function handleGraphQLErrors<T>(response: GraphQLResponse<T>): void {
    const errors = response.errors;

    if (!errors || errors.length === 0) return;

    // Filter out validation errors (let UI handle them)
    const nonValidationErrors = errors.filter(
        (e) => !['BAD_USER_INPUT', 'VALIDATION_FAILED'].includes(e.extensions?.code as string)
    );

    // If there are no non-validation errors, we return silently
    if (nonValidationErrors.length === 0) return;

    // If any authentication/authorization errors exist, throw AuthError
    const authError = nonValidationErrors.find((e) =>
        ['UNAUTHENTICATED', 'FORBIDDEN'].includes(e.extensions?.code as string)
    );
    if (authError) {
        throw new AuthError(authError.message);
    }

    // For all other cases, aggregate and throw as a single Error
    const combinedMessage = nonValidationErrors.map((e) => e.message).join('; ');
    throw new Error(combinedMessage);
}

/**
 * Handles GraphQL-auth errors (response.errors).
 * - UNAUTHENTICATED & FORBIDDEN throw AuthError
 * - Allow other errors to get through
 *
 * @param response GraphQL response to check
 * @throws {AuthError|Error} for non-validation errors
 */
export function handleGraphQLAuthErrors<T>(response: GraphQLResponse<T>): void {
    const errors = response.errors;
    if (!errors || errors.length === 0) return;

    const authError = errors.find((e) =>
        ['UNAUTHENTICATED', 'FORBIDDEN'].includes(e.extensions?.code as string)
    );

    if (authError) {
        throw new AuthError(authError.message);
    }
}
