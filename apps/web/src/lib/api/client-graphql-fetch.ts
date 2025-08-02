// File: apps/web/src/lib/api/client-graphql-fetch.ts
'use client';

import {NetworkError} from '@bunny/shared';
import {GraphQLResponse} from '@/types/graphql';
import {TOKEN_MODE} from '@/lib/config';
import {getValidAccessToken, refreshTokens} from '@/lib/auth/client-auth';
import {classifyGraphQLErrors, graphQlResponseHasInstanceOf} from '@/lib/api/graphql-error-helpers';
import {UnauthorizedException} from '@bunny/shared';
import {clientHandleGraphqlErrorsUiConvention} from '@/lib/api/client-handle-graphql-errors-ui-convention';

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
    const headers: Record<string, string> = {'Content-Type': 'application/json'};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(process.env.NEXT_PUBLIC_GRAPH_QL_API_URL ?? '', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({query, variables}),
        next: {revalidate},
    });

    if (!res.ok) {
        throw new NetworkError(`${res.status} ${res.statusText}`);
    }

    // No GraphQL errors handling here anymore, just return the result.
    // The caller should invoke handleGraphQLErrors to handle these.
    return await res.json();
}

// GraphQL requests with authentication
export async function fetchAuthGraphQL<T>(
    query?: string,
    options: FetchOptions = {}
): Promise<GraphQLResponse<T>> {
    if (TOKEN_MODE === 'cookie') {
        const response = await fetchGraphQLInternal<T>(query, {
            variables: options.variables,
            revalidate: options.revalidate,
        });
        const classifiedErrors = classifyGraphQLErrors(response);
        if (graphQlResponseHasInstanceOf(classifiedErrors, UnauthorizedException)) {
            await refreshTokens();
            const retriedResponse = await fetchGraphQLInternal<T>(query, {
                variables: options.variables,
                revalidate: options.revalidate,
            });
            clientHandleGraphqlErrorsUiConvention(retriedResponse);
            return retriedResponse;
        }
        clientHandleGraphqlErrorsUiConvention(response);
        return response;
    }

    const accessToken = await getValidAccessToken();
    const response = await fetchGraphQLInternal<T>(query, {
        variables: options.variables,
        accessToken,
        revalidate: options.revalidate,
    });

    const classifiedErrors = classifyGraphQLErrors(response);
    if (graphQlResponseHasInstanceOf(classifiedErrors, UnauthorizedException)) {
        const newToken = await getValidAccessToken();
        const retriedResponse = await fetchGraphQLInternal<T>(query, {
            variables: options.variables,
            accessToken: newToken,
            revalidate: options.revalidate,
        });
        clientHandleGraphqlErrorsUiConvention(retriedResponse);
        return retriedResponse;
    }
    clientHandleGraphqlErrorsUiConvention(response);
    return response;
}

// GraphQL request without authentication (public interface)
export async function fetchPublicGraphQL<T>(
    query?: string,
    options: FetchOptions = {}
): Promise<GraphQLResponse<T>> {
    const response = await fetchGraphQLInternal<T>(query, {
        variables: options.variables,
        revalidate: options.revalidate,
    });

    clientHandleGraphqlErrorsUiConvention(response);
    return response;
}
