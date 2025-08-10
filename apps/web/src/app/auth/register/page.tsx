import {RegisterForm} from '@/components/auth/register-form';
import {Suspense} from 'react';

export default function RegisterPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <Suspense>
                    <RegisterForm/>
                </Suspense>
            </div>
        </div>
    );
}