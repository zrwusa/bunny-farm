'use client';

import { ComponentPropsWithoutRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleLoginButton } from '@/components/features/auth/google-login';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useLazyQuery, useMutation } from '@apollo/client';
import { MeDocument, LocalLoginDocument, Mutation, Query } from '@/types/generated/graphql';

export type LoginFormProps = ComponentPropsWithoutRef<'div'> & {
    onSuccess?: () => void;
};

export function LoginForm({
                              className,
                              onSuccess,
                              ...props
                          }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { setUser } = useAuth();
    const from = searchParams.get('redirect') || '/';

    const [fetchMe] = useLazyQuery<Query>(MeDocument, {
        fetchPolicy: 'network-only',
    });

    // Apollo mutation for local login
    const [localLogin] = useMutation<Mutation>(LocalLoginDocument);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await localLogin({
                variables: {
                    input: {
                        email,
                        password,
                        type: 'local',
                    },
                },
            });

            const login = result.data?.login;
            if (login) {
                const { accessToken, refreshToken } = login;

                localStorage.setItem('ACCESS_TOKEN', accessToken);
                localStorage.setItem('REFRESH_TOKEN', refreshToken);

                // Refresh user state using Apollo
                const { data } = await fetchMe();
                const me = data?.me;
                if (me) setUser(me);

                // Redirect to original page after successful login
                router.replace(from);
                onSuccess?.();
            }
        } catch (err: unknown) {
            // Same error handling logic as before
            if (err instanceof Error && err.message?.includes('Invalid credentials')) {
                setError('Invalid email or password. Please try again.');
            } else if (typeof err === 'string' && err.includes('User not found')) {
                setError('Email not registered. Please sign up first.');
            } else {
                setError('Login failed. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <GoogleLoginButton from={from} onSuccess={onSuccess} />
                            </div>
                            <div
                                className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                            >
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-6">
                                {error && (
                                    <div className="text-sm text-red-500 text-center">
                                        {error}
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href={`/auth/register${from ? `?redirect=${encodeURIComponent(from)}` : ''}`}
                                    className="underline underline-offset-4"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
