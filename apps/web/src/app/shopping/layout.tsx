import type {Metadata} from 'next';
import {ReactNode} from 'react';
import FloatingCart from '@/app/shopping/_components/FloatingCart';
import NavBar from '@/app/shopping/_components/NavBar';

export const metadata: Metadata = {
    title: 'Bunny Shopping',
    description: '',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
            <NavBar/>
            {children}
            <FloatingCart/>
        </body>
        </html>
    );
}
