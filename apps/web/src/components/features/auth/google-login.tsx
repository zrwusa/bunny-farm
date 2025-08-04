'use client';

import { GoogleLogin } from '@react-oauth/google';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLazyQuery, useMutation } from '@apollo/client';
import { MeDocument, GoogleLoginDocument, Mutation, Query } from '@/types/generated/graphql';

export type GoogleLoginButtonProps = {
    from?: string;
    onSuccess?: () => void;
};

export const GoogleLoginButton = ({ from, onSuccess }: GoogleLoginButtonProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { setUser } = useAuth();

    const [fetchMe] = useLazyQuery<Query>(MeDocument, {
        fetchPolicy: 'network-only',
    });

    // Apollo mutation for Google login
    const [googleLogin] = useMutation<Mutation>(GoogleLoginDocument);

    return (
        <GoogleLogin
            onSuccess={async (response) => {
                const oauthToken = response.credential;

                const result = await googleLogin({
                    variables: {
                        input: {
                            type: 'google',
                            oauthToken,
                        },
                    },
                });

                const login = result.data?.login;

                if (login) {
                    const { accessToken, refreshToken } = login;

                    localStorage.setItem('ACCESS_TOKEN', accessToken);
                    localStorage.setItem('REFRESH_TOKEN', refreshToken);

                    // Refresh user state
                    const meResult = await fetchMe();
                    const me = meResult.data?.me;
                    if (me) setUser(me);

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
