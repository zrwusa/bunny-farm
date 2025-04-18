"use client"

import { GoogleLogin } from '@react-oauth/google';
import { useRouter, usePathname } from 'next/navigation';
import { googleLogin } from '@/lib/api/client-actions';

export type GoogleLoginButtonProps = {from?:string}
export const GoogleLoginButton = ({from}: GoogleLoginButtonProps) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <GoogleLogin
            onSuccess={async (response) => {
                const oauthToken = response.credential;

                const result = await googleLogin({
                    type: 'google',
                    oauthToken,
                });

                const { accessToken, refreshToken } = result;
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);

                // If no 'from' parameter is specified, use current path
                const redirectPath = from || pathname;
                router.replace(redirectPath);
            }}
            onError={() => {
                console.error('Google login failed');
            }}
        />
    );
};
