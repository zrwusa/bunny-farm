// File: apps/web/src/lib/api/graphql-fetch.ts
'use server';

import { cookies } from 'next/headers';
import { GraphQLError } from 'graphql/error';
import { AuthError, NetworkError } from '@/lib/errors';
import { GRAPH_QL_API_URL } from '@/lib/config';
import { FetchGraphQLOptions, GraphQLResponse } from '@/types/graphql';

// The server fetch cannot get updated cookies
// No browser
// No cookies are stored
// So the Set-Cookie returned by the API backend service is only valid in the server's fetch response this time, but it will not be automatically written to the browser cookie.function buildCookieHeader(accessToken?: string, refreshToken?: string): string {
function buildCookieHeader(accessToken?: string, refreshToken?: string): string {
    return [
        accessToken && `ACCESS_TOKEN=${accessToken}`,
        refreshToken && `REFRESH_TOKEN=${refreshToken}`,
    ]
        .filter(Boolean)
        .join('; ');
}

// Internal underlying request function
async function fetchGraphQLInternal<T>(
    query?: string,
    { variables, revalidate = 10, cookieHeader }: FetchGraphQLOptions & { cookieHeader?: string } = {}
): Promise<GraphQLResponse<T>> {
    const res = await fetch(GRAPH_QL_API_URL, {
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
            case 'UNAUTHENTICATED':
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

// With authentication (get token from server cookies)
export async function fetchAuthGraphQL<T>(
    query?: string,
    options?: { variables?: Record<string, unknown>; revalidate?: number }
): Promise<GraphQLResponse<T>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('ACCESS_TOKEN')?.value;
    const refreshToken = cookieStore.get('REFRESH_TOKEN')?.value;

    if (!refreshToken) throw new AuthError('Missing refresh token');

    const cookieHeader = buildCookieHeader(accessToken, refreshToken);

    // Why don't we do refreshTokens when server fetching?
    // Because these requests are initiated from the Next.js server, if you store tokens using cookies, you cannot write tokens to the browser at all.
    // If localStorage is used for storage, the server request here cannot obtain tokens at all.  return await fetchGraphQLInternal<T>(query, {
    return await fetchGraphQLInternal<T>(query, {
        ...options,
        cookieHeader,
    });
}

// No authentication required (for public interface)
export async function fetchPublicGraphQL<T>(
    query?: string,
    options?: { variables?: Record<string, unknown>; revalidate?: number }
): Promise<GraphQLResponse<T>> {
    return await fetchGraphQLInternal<T>(query, options);
}
