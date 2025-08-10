'use client';

import { ProductsTable } from '@/components/cms/product-table';
import { useProducts } from '@/hooks/product/use-products';

export default function ProductsPage() {
    const { data, loading, error } = useProducts();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        // Apollo error object - use existing helper
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Products</h1>
            {data?.products && <ProductsTable products={data.products} />}
        </div>
    );
}
