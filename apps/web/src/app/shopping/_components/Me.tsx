'use client'

import {useMe} from '@/hooks/use-me';
import {useRouter, usePathname} from 'next/navigation';
import {logout} from '@/app/client-actions';
import {Button} from '@/components/ui/button';

const Me = () => {
    const {user, isAuthenticated} = useMe();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div>
            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img src={user?.profile?.avatarUrl ?? ''} className="w-8 h-8 rounded-full"/>
                        <span>{user?.profile?.displayName}</span>
                    </div>
                    <Button variant="ghost" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            ) : (
                <button onClick={() => router.push(`/login?from=${pathname}`)}>Login</button>
            )}
        </div>
    );
};

export default Me;
