'use client'

import {useAuth} from '@/contexts/auth-context';
import {usePathname, useRouter} from 'next/navigation';
import Image from 'next/image';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '@/components/ui/dropdown-menu';
import {LogOut, User} from 'lucide-react';
import {Query} from '@/types/generated/graphql';

interface MeProps {
    me?: Query["me"]
}

export default function Me({me}: MeProps) {
    const {logout} = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push(`/auth/login?redirect=${pathname}`);
    };

    if (!me) {
        return (
            <button
                onClick={() => router.push(`/auth/login?redirect=${pathname}`)}
                className="text-sm font-medium hover:text-primary"
                data-testid="login-button"
            >
                Login
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 focus:outline-none"
                    data-testid="avatar-button"
                >
                    <Image
                        src={me?.profile?.avatarUrl ?? '/avatar.svg'}
                        alt={me?.profile?.displayName ?? 'User avatar'}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4"/>
                    <span>{me?.profile?.displayName ?? me?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                    data-testid="logout-button"
                >
                    <LogOut className="h-4 w-4"/>
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
