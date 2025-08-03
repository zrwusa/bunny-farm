// apps/web/src/lib/apollo/links/http-link.ts
import { createHttpLink } from '@apollo/client';

export const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPH_QL_API_URL,
    credentials: 'include', // supports cookie-mode login
});
