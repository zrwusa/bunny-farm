import type {Metadata} from 'next';
import {ReactNode} from 'react';
import FloatingCart from '@/app/shopping/_components/FloatingCart';
import NavBar from '@/app/shopping/_components/NavBar';

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
