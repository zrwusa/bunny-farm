'use server';

import { isTokenExpired, isTokenExpiringSoon } from './client-auth';
import { GraphQLError } from 'graphql/error';
import { AuthError, NetworkError } from '@/lib/errors';
import { getCookieTokens } from '@/lib/api/auth';
import { FetchGraphQLOptions, GraphQLResponse } from '@/types/graphql';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

function buildCookieHeader(accessToken?: string, refreshToken?: string): string {
    return [accessToken && `access_token=${accessToken}`, refreshToken && `refresh_token=${refreshToken}`]
        .filter(Boolean)
        .join('; ');
}

async function refreshTokensIfNeeded(): Promise<void> {
    const tokens = await getCookieTokens();
    if (!tokens?.accessToken || !tokens.refreshToken) {
        // Don't try to refresh during SSR
        if (typeof window === 'undefined') {
            throw new AuthError('No tokens in SSR context');
        }
        throw new AuthError('Missing tokens');
    }

    if (!isTokenExpired(tokens.accessToken) && !isTokenExpiringSoon(tokens.accessToken)) return;

    if (isRefreshing) return refreshPromise;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const cookieHeader = buildCookieHeader(tokens.accessToken, tokens.refreshToken);
            const response = await fetch('http://localhost:8080/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeader,
                },
                body: JSON.stringify({
                    query: `
            mutation RefreshToken($refreshToken: String!) {
              refreshToken(refreshToken: $refreshToken) {
                accessToken
                refreshToken
              }
            }
          `,
                    variables: { refreshToken: tokens.refreshToken },
                }),
            });

            if (!response.ok) throw new NetworkError('Token refresh failed');
        } catch (err) {
            console.error('Token refresh failed:', err);
            throw new AuthError('Refresh token failed');
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

async function doFetchGraphQL<T>(
    query?: string,
    { variables, revalidate = 10, cookieHeader }: FetchGraphQLOptions & { cookieHeader?: string } = {}
): Promise<GraphQLResponse<T>> {
    const res = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(cookieHeader && { Cookie: cookieHeader }),
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
    });

    if (!res.ok) throw new NetworkError(`${res.status} ${res.statusText}`);

    const result: GraphQLResponse<T> = await res.json();

    if (result.errors?.length) {
        const { message = 'GraphQL error occurred', extensions } = result.errors[0];
        switch (extensions?.code) {
            case 'UNAUTHORIZED':
            case 'FORBIDDEN':
                throw new AuthError(message);
            case 'BAD_USER_INPUT':
            case 'VALIDATION_FAILED':
                return result;
            case 'INTERNAL_SERVER_ERROR':
                throw new NetworkError('Server error');
            default:
                throw new GraphQLError(message);
        }
    }

    return result;
}

export async function fetchGraphQLPure<T>(query?: string, options?: FetchGraphQLOptions) {
    return doFetchGraphQL<T>(query, options);
}

export async function fetchGraphQL<T>(
    query?: string,
    options?: { variables?: Record<string, unknown>; revalidate?: number }
): Promise<GraphQLResponse<T>> {
    try {
        await refreshTokensIfNeeded();

        const tokens = await getCookieTokens();
        const cookieHeader = buildCookieHeader(tokens?.accessToken, tokens?.refreshToken);

        return await doFetchGraphQL<T>(query, {
            ...options,
            cookieHeader,
        });
    } catch (err) {
        if (err instanceof AuthError) {
            console.warn('Auth error, trying to refresh and retry:', err);
            try {
                await refreshTokensIfNeeded();
                const tokens = await getCookieTokens();
                const cookieHeader = buildCookieHeader(tokens?.accessToken, tokens?.refreshToken);

                return await doFetchGraphQL<T>(query, {
                    ...options,
                    cookieHeader,
                });
            } catch (refreshError) {
                // await removeCookieTokens();
                throw new AuthError('Re-authentication required');
            }
        }

        throw err;
    }
}


// 'use server';
//
// import { GraphQLError } from 'graphql/error';
// import { AuthError, NetworkError } from '@/lib/errors';
// import { getCookieTokens } from '@/lib/api/auth';
// import { FetchGraphQLOptions, GraphQLResponse } from '@/types/graphql';
//
// function buildCookieHeader(accessToken?: string, refreshToken?: string): string {
//     return [accessToken && `access_token=${accessToken}`, refreshToken && `refresh_token=${refreshToken}`]
//         .filter(Boolean)
//         .join('; ');
// }
//
// async function doFetchGraphQL<T>(
//     query?: string,
//     { variables, revalidate = 10, cookieHeader }: FetchGraphQLOptions & { cookieHeader?: string } = {}
// ): Promise<GraphQLResponse<T>> {
//     const res = await fetch('http://localhost:8080/graphql', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             ...(cookieHeader && { Cookie: cookieHeader }),
//         },
//         body: JSON.stringify({ query, variables }),
//         next: { revalidate },
//     });
//
//     if (!res.ok) throw new NetworkError(`${res.status} ${res.statusText}`);
//
//     const result: GraphQLResponse<T> = await res.json();
//
//     if (result.errors?.length) {
//         const { message = 'GraphQL error occurred', extensions } = result.errors[0];
//         switch (extensions?.code) {
//             case 'UNAUTHORIZED':
//             case 'FORBIDDEN':
//                 throw new AuthError(message);
//             case 'BAD_USER_INPUT':
//             case 'VALIDATION_FAILED':
//                 return result;
//             case 'INTERNAL_SERVER_ERROR':
//                 throw new NetworkError('Server error');
//             default:
//                 throw new GraphQLError(message);
//         }
//     }
//
//     return result;
// }
//
// export async function fetchGraphQLPure<T>(query?: string, options?: FetchGraphQLOptions) {
//     return doFetchGraphQL<T>(query, options);
// }
//
// export async function fetchGraphQL<T>(
//     query?: string,
//     options?: { variables?: Record<string, unknown>; revalidate?: number }
// ): Promise<GraphQLResponse<T>> {
//     const tokens = await getCookieTokens();
//     if (!tokens?.accessToken || !tokens.refreshToken) {
//         throw new AuthError('Missing access or refresh token');
//     }
//
//     const cookieHeader = buildCookieHeader(tokens.accessToken, tokens.refreshToken);
//
//     return await doFetchGraphQL<T>(query, {
//         ...options,
//         cookieHeader,
//     });
// }
