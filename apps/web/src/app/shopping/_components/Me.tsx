'use client'

import {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {getMeApolloGql, logout} from '@/app/client-actions';
import {Query} from '@/types/generated/graphql';
import Image from 'next/image';
import {Button} from '@/components/ui/button';

export default function Me() {
    const [user, setUser] = useState<Query['me'] | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await getMeApolloGql();
                setUser(result);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setIsAuthenticated(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            setIsAuthenticated(false);
            router.push('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <button onClick={() => router.push(`/login?from=${pathname}`)}>
                Login
            </button>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Image
                    src={user?.profile?.avatarUrl ?? '/avatar.svg'}
                    alt={user?.profile?.displayName ?? 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <span>{user?.profile?.displayName ?? user?.email}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
}
