import {objToGraphQLString} from '@/utils';
import {Product} from '@/types/generated/graphql';
import {revalidatePath} from 'next/cache';
import {fetchGraphQL} from '@/lib/api/graphql-fetch';
import {Mutation} from '@/types/generated/graphql';

export const createProductClient = async (prevState: Product, formData: FormData) => {
    const product = {...prevState, ...Object.fromEntries(formData.entries())} as Product;
    product.price = Number(product.price)
    const response = await fetchGraphQL<Mutation>(`mutation {
  createProduct(
    createProductInput: {${objToGraphQLString(product)}}
  ) {
    id
    price
    name
    brand
    description
  }
}`);

    if (response.errors && response.errors.length > 0) {
        return product;
    }
    const {createProduct} = response.data || {};
    if (createProduct?.id) return createProduct;
    return product;
}