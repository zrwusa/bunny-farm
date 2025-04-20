import { ProductList } from '@/app/shopping/_components/product-list';

interface ProductsPageProps {
    searchParams: { q?: string };
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
    return (
        <ProductList searchParams={searchParams} />
    )
}
export default ProductsPage;
