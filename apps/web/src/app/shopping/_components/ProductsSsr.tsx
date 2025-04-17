import ProductsSsrInner from '@/app/shopping/_components/ProductsSsrInner';
import {getProducts} from '@/app/actions';

export const ProductsSsr = async () => {
    const products = await getProducts();

    return <ProductsSsrInner title="Products SSR" products={products}></ProductsSsrInner>
}

export default ProductsSsr;