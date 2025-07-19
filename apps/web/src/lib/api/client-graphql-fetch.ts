// File: apps/web/src/lib/api/graphql-client.ts
'use client';

import { GraphQLError } from 'graphql/error';
import { AuthError, NetworkError } from '@/lib/errors';
import { GraphQLResponse } from '@/types/graphql';
import { TOKEN_MODE } from '@/lib/config';
import { getValidAccessToken, refreshTokens } from '@/lib/auth/client-auth';

interface FetchOptions {
    variables?: Record<string, unknown>;
    revalidate?: number;
}

// Internal underlying fetch method
async function fetchGraphQLInternal<T>(
    query: string | undefined,
    {
        variables,
        accessToken,
        revalidate = 10,
    }: {
        variables?: Record<string, unknown>;
        accessToken?: string;
        revalidate?: number;
    }
): Promise<GraphQLResponse<T>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(process.env.NEXT_PUBLIC_GRAPH_QL_API_URL ?? '', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
    });

    if (!res.ok) {
        throw new NetworkError(`${res.status} ${res.statusText}`);
    }

    const result: GraphQLResponse<T> = await res.json();

    if (result.errors?.length) {
        const { code } = result.errors[0].extensions ?? {};
        const message = result.errors[0].message;
        switch (code) {
            case 'UNAUTHORIZED':
            case 'FORBIDDEN':
            case 'UNAUTHENTICATED':
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

// GraphQL requests with authentication
export async function fetchAuthGraphQL<T>(
    query?: string,
    options: FetchOptions = {}
): Promise<GraphQLResponse<T>> {
    if (TOKEN_MODE === 'cookie') {
        try {
            return await fetchGraphQLInternal<T>(query, {
                variables: options.variables,
                revalidate: options.revalidate,
            });
        } catch (err: unknown) {
            if (err instanceof AuthError) {
                await refreshTokens();
                return fetchGraphQLInternal<T>(query, {
                    variables: options.variables,
                    revalidate: options.revalidate,
                });
            }
            throw err;
        }
    }

    const accessToken = await getValidAccessToken();
    try {
        return await fetchGraphQLInternal<T>(query, {
            variables: options.variables,
            accessToken,
            revalidate: options.revalidate,
        });
    } catch (err: unknown) {
        if (err instanceof AuthError) {
            const newToken = await getValidAccessToken();
            return fetchGraphQLInternal<T>(query, {
                variables: options.variables,
                accessToken: newToken,
                revalidate: options.revalidate,
            });
        }
        throw err;
    }
}

// GraphQL request without authentication (public interface)
export async function fetchPublicGraphQL<T>(
    query?: string,
    options: FetchOptions = {}
): Promise<GraphQLResponse<T>> {
    return fetchGraphQLInternal<T>(query, {
        variables: options.variables,
        revalidate: options.revalidate,
    });
}
