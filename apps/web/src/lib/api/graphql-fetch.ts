import { GraphQLResponse } from '@/types/generated/graphql';
import { getStoredTokens, isTokenExpired, isTokenExpiringSoon, setStoredTokens, getUserIdFromToken } from './auth';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshTokens() {
    if (isRefreshing) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const tokens = getStoredTokens();
            if (!tokens?.refreshToken) {
                throw new Error('No refresh token available');
            }

            const userId = getUserIdFromToken(tokens.refreshToken);
            if (!userId) {
                throw new Error('Invalid refresh token');
            }

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

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const result = await response.json();
            const { accessToken, refreshToken } = result.data.refreshToken;
            setStoredTokens(accessToken, refreshToken);
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export async function fetchGraphQL<T>(
    query?: string,
    options?: {
        variables?: Record<string, unknown>;
        revalidate?: number;
    }
): Promise<GraphQLResponse<T>> {
    const revalidate = options?.revalidate ?? 10;
    const variables = options?.variables;

    let tokens = getStoredTokens();

    // If token is expired or about to expire (within 1 minute), try to refresh
    if (tokens?.accessToken && (isTokenExpired(tokens.accessToken) || isTokenExpiringSoon(tokens.accessToken))) {
        try {
            await refreshTokens();
            tokens = getStoredTokens();
        } catch (error) {
            console.error('Failed to refresh token:', error);
            // If refresh fails, continue with current token
            // Server will return 401, and we'll try to refresh again
        }
    }

    const res = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
    });

    // If server returns 401, token is invalid, try to refresh
    if (res.status === 401) {
        try {
            await refreshTokens();
            tokens = getStoredTokens();
            // Retry the request with new token
            return fetchGraphQL(query, options);
        } catch (error) {
            console.error('Failed to refresh token after 401:', error);
            // If refresh fails, throw original error
            throw new Error(`GraphQL Error: ${res.status} ${res.statusText}`);
        }
    }

    if (!res.ok) {
        throw new Error(`GraphQL Error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
}
