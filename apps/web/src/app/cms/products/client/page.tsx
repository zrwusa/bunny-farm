'use client'

import {useEffect, useState} from 'react'
import {ProductsTable} from '@/components/features/cms/product-table'
import {Product} from '@/types/generated/graphql'
import {getProductsViaClient} from '@/lib/api/client-actions';
import {extractErrorsString} from '@/lib/api/graphql-error-helpers';


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[] | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await getProductsViaClient();

            setProducts(response?.data?.products);
            const errors = extractErrorsString(response);
            if (errors) setError(errors);


            setLoading(false)
        }

        fetchProducts().then()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Products</h1>
            {products && <ProductsTable products={products}/>}
        </div>
    )
}
