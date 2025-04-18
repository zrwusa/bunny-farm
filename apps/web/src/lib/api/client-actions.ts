import {objToGraphQLString} from '@/utils';
import {Product} from '@/types/generated/graphql';
import {fetchGraphQL} from './graphql-fetch';
import {Mutation, Query, LoginInput} from '@/types/generated/graphql';
import {ME_QUERY} from '@/lib/graphql';
import {GOOGLE_LOGIN, LOGOUT, CREATE_PRODUCT_CLIENT} from '@/lib/graphql/mutations';

export const createProductClient = async (prevState: Product, formData: FormData) => {
    const formEntries = Object.fromEntries(formData.entries());
    const product = {
        ...prevState,
        ...formEntries,
        price: Number(formEntries.price)
    } as Product;
    const response = await fetchGraphQL<Mutation>(CREATE_PRODUCT_CLIENT.loc?.source.body || '', {
        variables: {
            createProductInput: product
        }
    });

    if (response.errors && response.errors.length > 0) {
        return product;
    }
    const {createProduct} = response.data || {};
    if (createProduct?.id) return createProduct;
    return product;
}

export const getMeApolloGql = async () => {
    const response = await fetchGraphQL<Query>(ME_QUERY.loc?.source.body || '');
    return response.data?.me;
};

export const googleLogin = async (loginInput: LoginInput) => {
    const response = await fetchGraphQL<Mutation>(GOOGLE_LOGIN.loc?.source.body || '', {
        variables: {input: loginInput}
    });
    return response.data?.login;
};

export const logout = async () => {
    const response = await fetchGraphQL<Mutation>(LOGOUT.loc?.source.body || '');
    if (response.data?.logout) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
    return response.data?.logout;
};