import * as React from 'react'
import {ProductDetail} from '@/app/shopping/_components/product';
import {getProduct, getProductIds} from '@/app/actions';

// For SSR caching the detail pages
export async function generateStaticParams() {
    return await getProductIds();
}

const Detail = async ({params}: { params: Promise<{ id: string }> }) => {
    const {id} = await params;
    const product = await getProduct(id);
    return (
        <ProductDetail product={product}/>
    );
};

export default Detail;
