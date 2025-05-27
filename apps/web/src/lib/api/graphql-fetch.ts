import {
    getStoredTokens,
    isTokenExpired,
    isTokenExpiringSoon,
    setStoredTokens,
    getUserIdFromToken,
    removeStoredTokens
} from './auth';
import {GraphQLError} from 'graphql/error';
import {AuthError, NetworkError} from '@/lib/errors';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export type GraphQLOptions = {
    variables?: Record<string, unknown>;
    revalidate?: number;
    accessToken?: string;
};

export  type GraphQLResponse<T> = {
    data?: T;
    errors?: GraphQLError[];
};

async function refreshTokens() {
    if (isRefreshing) return refreshPromise;

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const tokens = await getStoredTokens();
            if (!tokens?.refreshToken) throw new AuthError('No refresh token available');

            const userId = getUserIdFromToken(tokens.refreshToken);
            if (!userId) throw new AuthError('Invalid refresh token');

            const response = await fetch('http://localhost:8080/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation RefreshToken($userId: String!, $refreshToken: String!) {
                            refreshToken(userId: $userId, refreshToken: $refreshToken) {
                                accessToken
                                refreshToken
                            }
                        }
                    `,
                    variables: {
                        userId,
                        refreshToken: tokens.refreshToken,
                    },
                }),
            });

            if (!response.ok) throw new NetworkError('Failed to refresh token');

            const result = await response.json();
            const { accessToken, refreshToken } = result.data.refreshToken;
            await setStoredTokens(accessToken, refreshToken);
        } catch (error) {
            console.error('Token refresh failed:', error);
            await removeStoredTokens();
            throw error;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export async function doFetchGraphQL<T>(
    query?: string,
    { variables, revalidate = 10, accessToken }: GraphQLOptions = {}
): Promise<GraphQLResponse<T>> {
    const res = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
    });

    if (!res.ok) {
        throw new NetworkError(`${res.status} ${res.statusText}`);
    }

    const result: GraphQLResponse<T> = await res.json();

    if (result.errors?.length) {
        const firstError = result.errors[0];
        const code = firstError.extensions?.code; // Use NestJS' throw new ForbiddenException(), which will also automatically add extensions.code
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

// fetchGraphQLPure: without token
export async function fetchGraphQLPure<T>(
    query?: string,
    options?: Omit<GraphQLOptions, 'accessToken'>
): Promise<GraphQLResponse<T>> {
    return doFetchGraphQL<T>(query, options);
}

// fetchGraphQL: Automatically handle tokens
export async function fetchGraphQL<T>(
    query?: string,
    options?: {
        variables?: Record<string, unknown>;
        revalidate?: number;
    }
): Promise<GraphQLResponse<T>> {
    let tokens = await getStoredTokens();

    if (tokens?.accessToken && (isTokenExpired(tokens.accessToken) || isTokenExpiringSoon(tokens.accessToken))) {
        try {
            await refreshTokens();
            tokens = await getStoredTokens();
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw new AuthError('Token refresh failed');
        }
    }

    try {
        return await doFetchGraphQL<T>(query, {
            ...options,
            accessToken: tokens?.accessToken,
        });
    } catch (error: unknown) {
        if (error instanceof AuthError) {
            try {
                await refreshTokens();
                tokens = await getStoredTokens();
                return await doFetchGraphQL<T>(query, {
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

