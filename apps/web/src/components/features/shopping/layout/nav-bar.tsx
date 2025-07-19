'use client';

import {useRouter} from 'next/navigation';
import Me from '@/components/features/auth/me';
import {SearchInput} from '@/components/ui/search-bar';
import {useEffect, useState} from 'react';
import {SUGGEST_PRODUCT_NAMES} from '@/lib/graphql';
import {fetchAuthGraphQL} from '@/lib/api/client-graphql-fetch';
import {Query} from '@/types/generated/graphql';


interface NavBarProps {
    me?: Query["me"]
}
const NavBar = ({ me }: NavBarProps) => {
    const router = useRouter();
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [suggestData, setSuggestData] = useState<Query | null>(null);

    useEffect(() => {
        const fetchSuggestData = async () => {
            if (!debouncedQuery) return;

            try {
                const result = await fetchAuthGraphQL<Query>(SUGGEST_PRODUCT_NAMES.loc?.source.body, {
                    variables: {input: debouncedQuery}
                });
                if (result.data) {
                    setSuggestData(result.data);
                }
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
            }
        };

        fetchSuggestData().then();
    }, [debouncedQuery]);

    const handleSearch = (value: string) => {
        router.push(`/shopping/products?q=${encodeURIComponent(value)}`);
    };

    return (
        <nav
            className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="w-full flex h-14 items-center px-4">
                <div className="flex">
                    <a className="mr-6 flex items-center space-x-2" href="/shopping">
                        <span className="font-bold">Bunny Farm</span>
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
                        <Me me={me}/>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
