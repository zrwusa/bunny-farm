"use client"

import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {logout} from '@/lib/api/client-actions';

export const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/auth');
    };

    return (
        <Button variant="ghost" onClick={handleLogout} data-testid="logout-button">
            Logout
        </Button>
    );
};