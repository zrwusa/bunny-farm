'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Query} from '@/types/generated/graphql';
import {getMe, logout} from '@/lib/api/client-actions';
import {getStoredTokens, isTokenExpiringSoon, refreshTokens, removeStoredTokens} from '@/lib/api/client-auth';
import {TOKEN_MODE} from '@/lib/config';
import {TokenMode} from '@/types/config';
import Image from 'next/image';
import {usePathname, useRouter} from 'next/navigation';

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
}

export function AuthProvider({children, tokenMode = TOKEN_MODE}: AuthProviderProps) {
    const [user, setUser] = useState<Query['me'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const initializeAuth = async () => {
            if (pathname === '/auth/login') {
                setIsLoading(false);
                return;
            }
            try {
                if (tokenMode === 'cookie') {
                    // Cookie mode: The backend will automatically read HttpOnly refresh_token. Since the front-end cannot get tokens in cookies, the access token can only be refreshed every time the app is started                    console.log('[AuthProvider] Cookie mode: refreshing token...');
                    await refreshTokens();
                } else {
                    // Storage mode: Check token and refresh
                    const tokens = await getStoredTokens();
                    if (
                        tokens?.refreshToken &&
                        !isTokenExpiringSoon(tokens.refreshToken) &&
                        (!tokens.accessToken || isTokenExpiringSoon(tokens.accessToken))
                    ) {
                        console.log('[AuthProvider] Header mode: refreshing token...');
                        await refreshTokens();
                    }
                }

                const result = await getMe();
                if (result) setUser(result);
            } catch (err) {
                console.warn('[AuthProvider] Auth init failed:', err);
                setError(err as Error);
                setUser(null);
                if (tokenMode === 'storage') await removeStoredTokens();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth().then();
    }, [tokenMode]);

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
                tokenMode
            }}
        >
            {isLoading ? <div className="flex items-center justify-center h-screen">
                <Image src="/cog.svg" width={100} height={100} alt="loading" />
            </div> : children} {/* Children are not loaded until the token refresh is complete */}
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
