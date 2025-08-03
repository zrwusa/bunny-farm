// apps/web/src/lib/apollo/client.ts
import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { httpLink } from './links/http-link';
import { authLink } from './links/auth-link';
import { errorLink } from './links/error-link';

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV !== 'production',
});
