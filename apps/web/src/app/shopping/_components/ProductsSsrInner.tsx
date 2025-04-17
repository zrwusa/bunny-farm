'use client'

import {useEffect, useState} from 'react';
import ProductList from '@/app/shopping/_components/ProductList';
import {Query} from '@/types/generated/graphql';
import {useListSize} from '@/app/shopping/_hooks/use-list-size';
import {SEARCH_PRODUCTS, SUGGEST_PRODUCT_NAMES} from '@/lib/graphql';
import {SearchInput} from '@/components/ui/search-bar';
import {fetchGraphQL} from '@/lib/graphql-fetch';

const ProductsSsrInner = ({title, products}: { title: string, products: Query['products'] }) => {
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [submitted, setSubmitted] = useState('');
    const [searchData, setSearchData] = useState<Query | null>(null);
    const [suggestData, setSuggestData] = useState<Query | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const size = useListSize();

    useEffect(() => {
        const fetchSearchData = async () => {
            if (!submitted) return;

            try {
                setLoading(true);
                const result = await fetchGraphQL<Query>(SEARCH_PRODUCTS.loc?.source.body, {
                    variables: { keyword: submitted }
                });
                setSearchData(result.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to search products'));
            } finally {
                setLoading(false);
            }
        };

        fetchSearchData();
    }, [submitted]);

    useEffect(() => {
        const fetchSuggestData = async () => {
            if (!debouncedQuery) return;

            try {
                console.log('Fetching suggestions for:', debouncedQuery);
                const result = await fetchGraphQL<Query>(SUGGEST_PRODUCT_NAMES.loc?.source.body, {
                    variables: { input: debouncedQuery }
                });
                console.log('Received suggestions:', result.data?.suggestProductNames);
                setSuggestData(result.data);
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
            }
        };

        fetchSuggestData();
    }, [debouncedQuery]);

    const displayedProducts = searchData?.searchProducts ?? products;
    const suggestProductNames = suggestData?.suggestProductNames ?? [];
    console.log('Current suggestions:', suggestProductNames);

    return (<>
        <SearchInput
            onDebouncedChange={(value) => {
                console.log('Debounced value changed:', value);
                setDebouncedQuery(value);
            }}
            suggestions={suggestProductNames}
            onSubmit={(value) => {
                setSubmitted(value);
                console.log('User final search submission:', value);
            }}
        />
        {
            error ? <span>{JSON.stringify(error)}</span>
                : loading ? <span>Loading</span>
                    : <ProductList title={title} products={displayedProducts} size={size}/>
        }
    </>)
};

export default ProductsSsrInner;
