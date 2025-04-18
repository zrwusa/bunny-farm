'use client'

import {Query} from '@/types/generated/graphql';
import {Card, CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import ProductList from '@/app/shopping/_components/ProductList';
import {GET_PRODUCTS} from '@/lib/graphql/queries';
import {useEffect, useMemo, useState} from 'react';
import {Input} from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import {useListSize} from '@/app/shopping/_hooks/use-list-size';
import {SEARCH_PRODUCTS, SUGGEST_PRODUCT_NAMES} from '@/lib/graphql';
import {fetchGraphQL} from '@/lib/api/graphql-fetch';

export const ProductsCsr = () => {
    const [data, setData] = useState<Query['products']>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query);
    const size = useListSize();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetchGraphQL<Query>(GET_PRODUCTS.loc?.source.body);
                setData(response.data.products);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch products'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        return data?.filter((product) => product.name.toLowerCase().includes(debouncedQuery.toLowerCase())) || [];
    }, [debouncedQuery, data]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(size)].map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="h-48 w-full"/>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2"/>
                            <Skeleton className="h-4 w-1/2"/>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <>
            <Input value={query} onChange={(event) => {
                setQuery(event.target.value);
            }}></Input>

            <ProductList title="Products CSR" products={filteredProducts} size={size}/>
        </>
    );
};
