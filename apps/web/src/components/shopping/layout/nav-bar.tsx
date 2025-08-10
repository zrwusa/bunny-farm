'use client';

import { useRouter } from 'next/navigation';
import Me from '@/components/auth/me';
import { SearchInput } from '@/components/ui/search-bar';
import { useEffect, useState } from 'react';
import { SUGGEST_PRODUCT_NAMES } from '@/lib/graphql';
import { useLazyQuery } from '@apollo/client';
import {MeQuery, SuggestProductNamesQuery} from '@/types/generated/graphql';
import Image from 'next/image';

interface NavBarProps {
    me?: MeQuery['me'];
}

const NavBar = ({ me }: NavBarProps) => {
    const router = useRouter();
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Apollo lazy query for product name suggestions
    const [fetchSuggestions, { data: suggestData }] = useLazyQuery<SuggestProductNamesQuery>(SUGGEST_PRODUCT_NAMES);

    useEffect(() => {
        if (!debouncedQuery) return;

        // Trigger the lazy query
        fetchSuggestions({
            variables: { input: debouncedQuery },
        }).catch((err) => {
            console.error('Failed to fetch suggestions:', err);
        });
    }, [debouncedQuery, fetchSuggestions]);

    const handleSearch = (value: string) => {
        router.push(`/shopping/products?q=${encodeURIComponent(value)}`);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="w-full flex h-14 items-center px-4">
                <div className="flex">
                    <a className="mr-6 flex items-center space-x-2" href="/shopping">
                        <Image src="/images/bunny-farm-text-cut.png" alt="bunny-farm" width={160} height={65} />
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-between">
                    <div className="w-full mr-6">
                        <SearchInput
                            onDebouncedChange={(value) => {
                                setDebouncedQuery(value);
                            }}
                            suggestions={suggestData?.suggestProductNames ?? []}
                            placeholder="Search products..."
                            onSubmit={handleSearch}
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Me me={me} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
