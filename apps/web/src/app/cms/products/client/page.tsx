'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {ProductsTable} from '@/app/cms/_components/product-table'
import {Product} from '@/types/generated/graphql'
import {fetchGraphQL} from '@/lib/api/graphql-fetch'

interface ProductsResponse {
    products: Product[]
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetchGraphQL<ProductsResponse>(
                    `query GetProducts {
                        products {
                            id
                            name
                            description
                            brand {
                                id
                                name
                            }
                            variants {
                                id
                                prices {
                                    id
                                    price
                                }
                            }
                        }
                    }`
                )

                if (response.errors) {
                    throw new Error(response.errors[0].message)
                }

                if (!response.data) {
                    throw new Error('No data returned from API')
                }

                setProducts(response.data.products)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
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
            <ProductsTable products={products} />
        </div>
    )
}
