'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import {ReactNode, useEffect} from 'react';

interface PrivateProps {
    children: ReactNode;
}

export function Private({ children }: PrivateProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user) {
            const loginUrl = `/auth/login?from=${encodeURIComponent(pathname)}`;
            router.replace(loginUrl);
        }
    }, [user, isLoading, pathname, router]);

    // Optional: Children can not be rendered when not logged in
    if (isLoading || !user) {
        return null;
    }

    return <>{children}</>;
}
