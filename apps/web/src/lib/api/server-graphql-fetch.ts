// File: apps/web/src/lib/api/server-graphql-fetch.ts
'use server';

import {cookies} from 'next/headers';
import {AuthError, NetworkError} from '@/lib/errors';
import {GRAPH_QL_API_URL} from '@/lib/config';
import {FetchGraphQLOptions, GraphQLResponse} from '@/types/graphql';

// Build a cookie header from available tokens
function buildCookieHeader(accessToken?: string, refreshToken?: string): string {
    return [
        accessToken && `ACCESS_TOKEN=${accessToken}`,
        refreshToken && `REFRESH_TOKEN=${refreshToken}`,
    ]
        .filter(Boolean)
        .join('; ');
}

// Internal underlying GraphQL request function
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

    // No GraphQL errors handling here.
    // Let caller handle GraphQL errors centrally.
    return await res.json();
}

// With authentication (tokens are taken from server cookies)
export async function fetchAuthGraphQL<T>(
    query?: string,
    options?: { variables?: Record<string, unknown>; revalidate?: number }
): Promise<GraphQLResponse<T>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('ACCESS_TOKEN')?.value;
    const refreshToken = cookieStore.get('REFRESH_TOKEN')?.value;

    if (!refreshToken) throw new AuthError('Missing refresh token');

    const cookieHeader = buildCookieHeader(accessToken, refreshToken);

    // We don't do token refresh on server because server cannot update browser cookies
    return await fetchGraphQLInternal<T>(query, {
        ...options,
        cookieHeader,
    });
}

// No authentication required (for public queries)
export async function fetchPublicGraphQL<T>(
    query?: string,
    options?: { variables?: Record<string, unknown>; revalidate?: number }
): Promise<GraphQLResponse<T>> {
    return await fetchGraphQLInternal<T>(query, options);
}
