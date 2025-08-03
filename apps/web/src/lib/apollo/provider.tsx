// apps/web/src/lib/apollo/provider.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './client';
import { ReactNode } from 'react';

export function ApolloWrapper({ children }: { children: ReactNode }) {
    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
