import { ListSizeProvider } from '@/app/shopping/_hooks/list-size-context';
import { ProductsSsr } from '@/app/shopping/_components/products-ssr';


interface ProductsPageProps {
    searchParams: { q?: string };
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
    return (
        <ListSizeProvider listSize={20}>
            <ProductsSsr searchParams={searchParams} />
        </ListSizeProvider>
    )
}
export default ProductsPage;
