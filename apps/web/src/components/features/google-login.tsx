"use client"

import { GoogleLogin } from '@react-oauth/google';
import { useRouter, usePathname } from 'next/navigation';
import { googleLogin, getMe } from '@/lib/api/client-actions';
import { useAuth } from '@/contexts/auth-context';

export type GoogleLoginButtonProps = {
    from?: string;
    onSuccess?: () => void;
}

export const GoogleLoginButton = ({from, onSuccess}: GoogleLoginButtonProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { setUser } = useAuth();

    return (
        <GoogleLogin
            onSuccess={async (response) => {
                const oauthToken = response.credential;

                const result = await googleLogin({
                    type: 'google',
                    oauthToken,
                });

                if (result) {
                    const { accessToken, refreshToken } = result;
                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('refresh_token', refreshToken);

                    // Refresh user state
                    const me = await getMe();
                    if(me) setUser(me);

                    // If no 'from' parameter is specified, use current path
                    const redirectPath = from || pathname;
                    router.replace(redirectPath);

                    // Call onSuccess callback if provided
                    onSuccess?.();
                }
            }}
            onError={() => {
                console.error('Google login failed');
            }}
        />
    );
};
