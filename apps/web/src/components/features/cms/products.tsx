'use client'

import {Product} from '@/types/generated/graphql';


const Products = ({products}: { products?: Product[] }) => {

    return (
        <div>
            <ul>
                {products?.map(({name, id}) => <li key={id}>{name}</li>)}
            </ul>

        </div>
    );
};

export default Products;
