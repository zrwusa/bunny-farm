import Image from 'next/image';

import Link from 'next/link';
import {Query} from '@/types/generated/graphql';

interface SsrMeProps {
    me?: Query["me"]
}

export default function SsrMe ({me}: SsrMeProps) {

    if (!me) {
        return (
            <Link
                href={`/auth/login?redirect=products`}
                className="text-sm font-medium hover:text-primary"
                data-testid="login-button"
            >
                Login
            </Link>
        );
    }

    return (
        <button
            className="flex items-center gap-2 focus:outline-none"
            data-testid="avatar-button"
        >
            <Image
                src={me?.profile?.avatarUrl ?? '/avatar.svg'}
                alt={me?.profile?.displayName ?? 'User avatar'}
                width={32}
                height={32}
                className="rounded-full"
            />
        </button>
    );
}
