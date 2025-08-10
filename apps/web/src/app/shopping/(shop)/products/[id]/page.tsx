import * as React from 'react'
import {Product} from '@/components/shopping/shop/product';
import {getProduct} from '@/lib/api/server-actions';

// // For SSR caching the detail pages
// export async function generateStaticParams() {
//     return await getProductIds();
// }

const ProductDetailPage = async ({params}: { params: Promise<{ id: string }> }) => {
    const {id} = await params;
    const product = await getProduct(id);
    return (
        <div className="mx-auto p-6">
            <Product product={product}/>
        </div>
    );
};

export default ProductDetailPage;
