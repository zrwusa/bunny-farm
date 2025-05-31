import type {Metadata} from 'next';
import {ReactNode} from 'react';
import FloatingCart from '@/components/features/shopping/cart/floating-cart';
import NavBar from '@/components/features/shopping/layout/nav-bar';

export const metadata: Metadata = {
    title: 'Bunny Shopping',
    description: '',
};

export default function ShopLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <>
            <NavBar/>
            {children}
            <FloatingCart/>
        </>
    );
}
