'use client'

import {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {getMeApolloGql, logout} from '@/lib/api/client-actions';
import {Query} from '@/types/generated/graphql';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {LogOut, User} from "lucide-react";

export default function Me() {
    const [user, setUser] = useState<Query['me'] | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await getMeApolloGql();
                if (result) {
                    setUser(result);
                    setIsAuthenticated(true);
                }
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
            <button
                onClick={() => router.push(`/login?from=${pathname}`)}
                className="text-sm font-medium hover:text-primary"
            >
                Login
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                    <Image
                        src={user?.profile?.avatarUrl ?? '/avatar.svg'}
                        alt={user?.profile?.displayName ?? 'User avatar'}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user?.profile?.displayName ?? user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
