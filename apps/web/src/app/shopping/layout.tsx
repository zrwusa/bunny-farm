import type {Metadata} from 'next';
import {ReactNode} from 'react';

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
        </div>
    );
}