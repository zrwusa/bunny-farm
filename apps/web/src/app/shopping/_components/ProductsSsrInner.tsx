'use client'


import {Query} from '@/types/generated/graphql';
import ProductList from '@/app/shopping/_components/ProductList';
import {useListSize} from '@/app/shopping/_hooks/use-list-size';

const ProductsSsrInner = ({title, products}: { title: string, products: Query['products'] }) => {
    const size = useListSize();

    return (
        <ProductList title={title} products={products} size={size}/>
    );
};

export default ProductsSsrInner;
