'use client'

import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {Product} from '@/store/app';


const Products = ({products}: { products?: Product[] }) => {

    const {products: productsState} = useSelector((rootState: RootState) => rootState.product)
    products = products || productsState;

    return (
        <div>
            <ul>
                {products?.map(({name, id}) => <li key={id}>{name}</li>)}
            </ul>

        </div>
    );
};

export default Products;
