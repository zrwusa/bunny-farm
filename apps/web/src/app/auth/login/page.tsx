import {LoginForm} from '@/components/features/auth/login-form';
import {Suspense} from 'react';

export default function LoginPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <Suspense>
                    <LoginForm/>
                </Suspense>
            </div>
        </div>
    );
}
