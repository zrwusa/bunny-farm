import {ListSizeProvider} from '@/app/shopping/_hooks/list-size-context';
import {ProductsSsr} from '@/app/shopping/_components/ProductsSsr';
// import {ProductsCsr} from '@/app/shopping/_components/ProductsCsr';
// import {ProductsSsrApollo} from '@/app/shopping/_components/ProductsSsrApollo';


const ProductsPage = () => {

    return (
        <ListSizeProvider listSize={20}>
            <ProductsSsr/>
            {/*<ProductsCsr/>*/}
            {/*<ProductsSsrApollo/>*/}
        </ListSizeProvider>
    )
}

export default ProductsPage;