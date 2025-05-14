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
            const tokens = await getStoredTokens();
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
            await setStoredTokens(accessToken, refreshToken);
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
type GraphQLOptions = {
    variables?: Record<string, unknown>;
    revalidate?: number;
    accessToken?: string;
};

async function doFetchGraphQL<T>(
    query?: string,
    { variables, revalidate = 10, accessToken }: GraphQLOptions = {}
): Promise<{ data: T }> {
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
        throw new Error(`GraphQL Error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// fetchGraphQLPure: without token
export async function fetchGraphQLPure<T>(
    query?: string,
    options?: {
        variables?: Record<string, unknown>;
        revalidate?: number;
    }
): Promise<{ data: T }> {
    return doFetchGraphQL<T>(query, options);
}

// fetchGraphQL: Automatically handle tokens
export async function fetchGraphQL<T>(
    query?: string,
    options?: {
        variables?: Record<string, unknown>;
        revalidate?: number;
    }
): Promise<{ data: T }> {
    let tokens = await getStoredTokens();

    if (tokens?.accessToken && (isTokenExpired(tokens.accessToken) || isTokenExpiringSoon(tokens.accessToken))) {
        try {
            await refreshTokens();
            tokens = await getStoredTokens();
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    }

    try {
        return await doFetchGraphQL<T>(query, {
            ...options,
            accessToken: tokens?.accessToken,
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('401')) {
            try {
                await refreshTokens();
                tokens = await getStoredTokens();
                return await doFetchGraphQL<T>(query, {
                    ...options,
                    accessToken: tokens?.accessToken,
                });
            } catch (refreshError) {
                console.error('Failed to refresh token after 401:', refreshError);
            }
        }

        throw error;
    }
}

