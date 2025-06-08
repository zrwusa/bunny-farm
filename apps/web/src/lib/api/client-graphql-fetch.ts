'use client'

import {getStoredTokens, isTokenExpiringSoon, refreshTokens, removeStoredTokens,} from './client-auth';
import {GraphQLError} from 'graphql/error';
import {AuthError, NetworkError} from '@/lib/errors';
import {GraphQLResponse} from '@/types/graphql';
import {GRAPH_QL_API_URL, TOKEN_MODE} from '@/lib/config';

async function internalFetchGraphQL<T>(
    query?: string,
    {
        variables,
        revalidate = 10,
        accessToken,
    }: {
        variables?: Record<string, unknown>;
        revalidate?: number;
        accessToken?: string;
    } = {}
): Promise<GraphQLResponse<T>> {
    const res = await fetch(GRAPH_QL_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(TOKEN_MODE === 'storage' && accessToken
                ? {Authorization: `Bearer ${accessToken}`}
                : {}),
        },
        credentials: 'include', // always include cookies
        body: JSON.stringify({query, variables}),
        next: {revalidate},
    });

    if (!res.ok) {
        throw new NetworkError(`${res.status} ${res.statusText}`);
    }

    const result: GraphQLResponse<T> = await res.json();

    if (result.errors?.length) {
        const firstError = result.errors[0];
        const code = firstError.extensions?.code;
        const message = firstError.message || 'GraphQL error occurred';

        switch (code) {
            case 'UNAUTHORIZED':
            case 'FORBIDDEN':
                throw new AuthError(message);
            case 'BAD_USER_INPUT':
            case 'VALIDATION_FAILED':
                return result;
            case 'INTERNAL_SERVER_ERROR':
                throw new NetworkError('Server encountered an error');
            default:
                throw new GraphQLError(message);
        }
    }

    return result;
}

export async function fetchGraphQL<T>(
    query?: string,
    options?: {
        variables?: Record<string, unknown>;
        revalidate?: number;
    }
): Promise<GraphQLResponse<T>> {
    if (TOKEN_MODE === 'cookie') {
        // Cookie mode: The browser automatically brings cookies without processing tokens
        return internalFetchGraphQL<T>(query, options);
    }

    // storage mode
    let tokens = await getStoredTokens();

    if (tokens?.accessToken && isTokenExpiringSoon(tokens.accessToken)) {
        try {
            await refreshTokens();
            tokens = await getStoredTokens();
        } catch (err) {
            console.warn('Token refresh failed before fetch:', err);
            await removeStoredTokens();
            throw new AuthError('Re-authentication required');
        }
    }

    try {
        return await internalFetchGraphQL<T>(query, {
            ...options,
            accessToken: tokens?.accessToken,
        });
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            try {
                await refreshTokens();
                tokens = await getStoredTokens();
                return await internalFetchGraphQL<T>(query, {
                    ...options,
                    accessToken: tokens?.accessToken,
                });
            } catch (refreshError) {
                console.error('Failed to refresh token after 401:', refreshError);
                await removeStoredTokens();
                throw new AuthError('Re-authentication required');
            }
        }

        throw error;
    }
}
