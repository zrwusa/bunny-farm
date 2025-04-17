import Products from '@/app/cms/_components/products';
import {getProducts} from '@/app/actions';

const ProductList = async () => {
    const products = await getProducts();

    return (
        <div>
            <Products products={products}/>
        </div>
    );
};

export default ProductList;
