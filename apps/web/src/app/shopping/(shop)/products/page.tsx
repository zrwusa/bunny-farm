import {ListSizeProvider} from '@/app/shopping/_hooks/list-size-context';
import {ProductsSsr} from '@/app/shopping/_components/ProductsSsr';
// import {ProductsCsr} from '@/app/shopping/_components/ProductsCsr';
// import {ProductsSsrApollo} from '@/app/shopping/_components/ProductsSsrApollo';

interface ProductsPageProps {
    searchParams: { q?: string };
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
    return (
        <ListSizeProvider listSize={20}>
            <ProductsSsr searchParams={searchParams}/>
            {/*<ProductsCsr/>*/}
            {/*<ProductsSsrApollo/>*/}
        </ListSizeProvider>
    )
}
export default ProductsPage;
