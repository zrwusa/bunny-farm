import {Query} from '@/types/generated/graphql';
import {GET_PRODUCTS} from '@/lib/graphql/queries';
import ProductsSsrInner from '@/app/shopping/_components/ProductsSsrInner';
import {fetchGraphQL} from '@/lib/graphql-fetch';

async function getProducts() {
    const response = await fetchGraphQL<Query>(GET_PRODUCTS.loc?.source.body, {
        revalidate: 30
    });
    return response.data.products;
}

export const ProductsSsrApollo = async () => {
    const products = await getProducts();

    return (
        <ProductsSsrInner title="Products SSR" products={products}/>
    );
}
