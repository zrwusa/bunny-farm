'use client'

import {createContext, useContext, useEffect, useState} from 'react';
import {Query} from '@/types/generated/graphql';
import {getMe, logout} from '@/lib/api/client-actions';

interface AuthContextType {
    user: Query['me'] | null;
    isLoading: boolean;
    error: Error | null;
    logout: () => Promise<void>;
    setUser: (user: Query['me'] | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<Query['me'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await getMe();
                if (result) setUser(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (err) {
            setError(err as Error);
        }
    };

    return (
        <AuthContext.Provider value={{user, isLoading, error, logout: handleLogout, setUser}}>
            {children}
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