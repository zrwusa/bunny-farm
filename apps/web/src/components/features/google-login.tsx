"use client"

import { GoogleLogin } from '@react-oauth/google';
import {googleLogin} from '@/app/client-actions';
import {useRouter, usePathname} from 'next/navigation';

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

                // 如果没有指定 from 参数，则使用当前路径
                const redirectPath = from || pathname;
                router.replace(redirectPath);
            }}
            onError={() => {
                console.error('Google login failed');
            }}
        />
    );
};
