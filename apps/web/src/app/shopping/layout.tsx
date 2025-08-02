import type {Metadata} from 'next';
import {ReactNode} from 'react';
import {Toaster} from '@/components/ui/sonner';

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
        <div>
            {children}
            <Toaster />
        </div>
    );
}