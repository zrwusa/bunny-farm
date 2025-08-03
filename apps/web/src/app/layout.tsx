import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {ReactNode} from 'react';
import ReduxProvider from '@/providers/redux-provider';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {AuthProvider} from '@/contexts/auth-context';
import { ApolloWrapper } from '@/lib/apollo/provider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Bunny Farm',
    description: '',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
              suppressHydrationWarning>
        <ApolloWrapper>
        <ReduxProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </GoogleOAuthProvider>
        </ReduxProvider>
        </ApolloWrapper>
        </body>
        </html>
    );
}
