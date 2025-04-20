import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Query} from '@/types/generated/graphql';
import {GET_PRODUCTS} from '@/lib/graphql/queries';
import ProductsSsrInner from '@/app/shopping/_components/products-ssr-inner';
import {fetchGraphQL} from '@/lib/api/graphql-fetch';

async function getProducts() {
    const response = await fetchGraphQL<Query>(GET_PRODUCTS.loc?.source.body, {
        revalidate: 30
    });
    return response.data?.products;
}

export const ProductsSsrApollo = async () => {
    const products = await getProducts();

    return (
        <ProductsSsrInner title="Products SSR" products={products}/>
    );
}
