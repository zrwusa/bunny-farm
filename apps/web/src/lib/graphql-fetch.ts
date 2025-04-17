export interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{
            line: number;
            column: number;
        }>;
        path?: string[];
    }>;
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

    // Get token from localStorage (browser environment only)
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';

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
