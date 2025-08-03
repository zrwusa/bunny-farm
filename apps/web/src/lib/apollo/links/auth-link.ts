// apps/web/src/lib/apollo/links/auth-link.ts
import { setContext } from '@apollo/client/link/context';
import { getValidAccessToken } from '@/lib/auth/client-auth';
import { TOKEN_MODE } from '@/lib/config';

export const authLink = setContext(async (_, { headers }) => {
    if (TOKEN_MODE === 'storage') {
        const token = await getValidAccessToken();
        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : '',
            },
        };
    }

    // For cookie-based auth, just set credentials on httpLink
    return { headers };
});
