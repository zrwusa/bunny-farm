import Products from '@/components/features/cms/products';
import {getProducts} from '@/lib/api/server-actions';

const ProductList = async () => {
    const products = await getProducts();

    return (
        <div>
            <Products products={products}/>
        </div>
    );
};

export default ProductList;
