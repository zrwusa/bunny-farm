// apps/web/src/contexts/auth-context.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Query, Mutation, MeDocument, LogoutDocument } from '@/types/generated/graphql';
import { removeStoredTokens } from '@/lib/auth/client-auth';
import { TOKEN_MODE } from '@/lib/config';
import { TokenMode } from '@/types/config';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { isAuthExemptPath } from '@bunny/shared/dist/utils/auth';
import { useLazyQuery, useMutation } from '@apollo/client';

interface AuthContextType {
    user: Query['me'] | null;
    isLoading: boolean;
    error: Error | null;
    logout: () => Promise<void>;
    setUser: (user: Query['me'] | null) => void;
    tokenMode: TokenMode;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
    tokenMode?: TokenMode;

    /**
     * If you have SSR Embed, you can pass it in when using <AuthProvider ssrUser={...}>
     * In this way, the CSR can be reused directly when starting, without adjusting /me
     */
    ssrUser?: Query['me'] | null;
}

export function AuthProvider({
                                 children,
                                 tokenMode = TOKEN_MODE,
                                 ssrUser = null,
                             }: AuthProviderProps) {
    const [user, setUser] = useState<Query['me'] | null>(ssrUser ?? null);
    const [isLoading, setIsLoading] = useState(!ssrUser); // If the SSR already has a user, loading is not required
    const [error, setError] = useState<Error | null>(null);
    const pathname = usePathname();

    const [fetchMe] = useLazyQuery<Query>(MeDocument, {
        fetchPolicy: 'network-only', // Avoid returning cached value on login
    });

    const [logoutMutation] = useMutation<Mutation>(LogoutDocument);

    useEffect(() => {
        if (ssrUser || isAuthExemptPath(pathname)) {
            setIsLoading(false);
            return;
        }

        const initializeAuth = async () => {
            try {
                const { data } = await fetchMe();
                if (data?.me) {
                    setUser(data.me);
                } else {
                    console.warn('[AuthProvider] Cookie mode: still no user after refresh.');
                    setUser(null);
                }
            } catch (err) {
                console.warn('[AuthProvider] Auth init failed:', err);
                setError(err as Error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth().then();
    }, [tokenMode, pathname, ssrUser, fetchMe]);

    const handleLogout = async () => {
        try {
            await logoutMutation();
            await removeStoredTokens();
            setUser(null);
        } catch (err) {
            setError(err as Error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                logout: handleLogout,
                setUser,
                tokenMode,
            }}
        >
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <Image priority={true} src="/cog.svg" width={100} height={100} alt="loading" />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

