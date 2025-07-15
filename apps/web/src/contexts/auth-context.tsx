// apps/web/src/contexts/auth-context.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Query } from '@/types/generated/graphql';
import { getMe, logout } from '@/lib/api/client-actions';
import { removeStoredTokens } from '@/lib/auth/client-auth';
import { TOKEN_MODE } from '@/lib/config';
import { TokenMode } from '@/types/config';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { isAuthExemptPath } from '@bunny/shared/dist/utils/auth';

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

    useEffect(() => {
        if (ssrUser || isAuthExemptPath(pathname)) {
            setIsLoading(false)
            return;
        }
        const initializeAuth = async () => {
            try {
                    const me = await getMe();

                    if (me) {
                        setUser(me);
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
    }, [tokenMode, pathname, ssrUser]);

    const handleLogout = async () => {
        try {
            await logout();
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
                    <Image src="/cog.svg" width={100} height={100} alt="loading" />
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
