import * as React from 'react'
import {Product} from '@/components/features/shopping/shop/product';
import {getProduct, getProductIds} from '@/lib/api/actions';

// // For SSR caching the detail pages
// export async function generateStaticParams() {
//     return await getProductIds();
// }

const Detail = async ({params}: { params: Promise<{ id: string }> }) => {
    const {id} = await params;
    const product = await getProduct(id);
    return (
        <Product product={product}/>
    );
};

export default Detail;
