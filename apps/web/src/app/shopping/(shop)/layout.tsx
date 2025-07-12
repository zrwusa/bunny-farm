// apps/web/src/app/shopping/(shop)/layout.tsx

import type { Metadata } from 'next';
import { ReactNode } from 'react';
import FloatingCart from '@/components/features/shopping/cart/floating-cart';
import NavBar from '@/components/features/shopping/layout/nav-bar';
import { getMe } from '@/lib/api/server-actions';

export const metadata: Metadata = {
    title: 'Bunny Shopping',
    description: '',
};

export default async function ShopLayout({
                                             children,
                                         }: {
    children: ReactNode;
}) {
    const me = await getMe();
    return (
        <>
            <NavBar me={me} />
            {children}
            <FloatingCart/>
        </>
    );
}
