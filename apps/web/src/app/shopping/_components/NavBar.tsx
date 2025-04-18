'use client';

import { useRouter } from 'next/navigation';
import Me from '@/app/shopping/_components/Me';
import { SearchInput } from '@/components/ui/search-bar';
import { useState, useEffect } from 'react';
import { SEARCH_PRODUCTS, SUGGEST_PRODUCT_NAMES } from '@/lib/graphql';
import { fetchGraphQL } from '@/lib/api/graphql-fetch';
import { Query } from '@/types/generated/graphql';

const NavBar = () => {
  const router = useRouter();
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestData, setSuggestData] = useState<Query | null>(null);

  useEffect(() => {
    const fetchSuggestData = async () => {
      if (!debouncedQuery) return;

      try {
        console.log('Fetching suggestions for:', debouncedQuery);
        const result = await fetchGraphQL<Query>(SUGGEST_PRODUCT_NAMES.loc?.source.body, {
          variables: { input: debouncedQuery }
        });
        console.log('Received suggestions:', result.data?.suggestProductNames);
        if (result.data) {
          setSuggestData(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };

    fetchSuggestData();
  }, [debouncedQuery]);

  const handleSearch = (value: string) => {
    router.push(`/shopping/products?q=${encodeURIComponent(value)}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                console.log('Debounced value changed:', value);
                setDebouncedQuery(value);
              }}
              suggestions={suggestData?.suggestProductNames ?? []}
              placeholder="Search products..."
              onSubmit={handleSearch}
            />
          </div>
          <div className="flex items-center justify-end">
            <Me />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
