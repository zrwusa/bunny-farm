'use server';

import { GraphQLError } from 'graphql/error';
import { AuthError, NetworkError } from '@/lib/errors';
import { getCookieTokens } from '@/lib/api/auth';
import { FetchGraphQLOptions, GraphQLResponse } from '@/types/graphql';
import {GRAPH_QL_API_URL} from '@/lib/config';

// The server fetch cannot get updated cookies
// No browser
// No cookies are stored
// So the Set-Cookie returned by the API backend service is only valid in the server's fetch response this time, but it will not be automatically written to the browser cookie.
function buildCookieHeader(accessToken?: string, refreshToken?: string): string {
    return [accessToken && `access_token=${accessToken}`, refreshToken && `refresh_token=${refreshToken}`]
        .filter(Boolean)
        .join('; ');
}


async function doFetchGraphQL<T>(
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
        console.debug('---extensions?.code', extensions?.code)
        switch (extensions?.code) {
            case 'UNAUTHENTICATED': //HTTP 401, Not logged in / Token invalid
            case 'UNAUTHORIZED':    //HTTP xxx, not recommended to use it alone, the meaning is vague
            case 'FORBIDDEN':       //HTTP 403, logged in but insufficient permissions
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
    const tokens = await getCookieTokens();
    if (!tokens.refreshToken) {
        throw new AuthError('Missing access or refresh token');
    }

    const cookieHeader = buildCookieHeader(tokens.accessToken, tokens.refreshToken);

    return await doFetchGraphQL<T>(query, {
        ...options,
        cookieHeader,
    });
}
