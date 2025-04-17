'use server'

import {Product, User} from '@/store/app';
import {objToGraphQLString} from '@/utils';
import {fetchGraphQL} from '@/lib/graphql-fetch';
import {Mutation, Query} from '@/types/generated/graphql';
import {GET_PRODUCT, GET_PRODUCTS, GET_PRODUCT_IDS, GET_USERS} from '@/lib/graphql/queries';
import {CREATE_PRODUCT} from '@/lib/graphql/mutations';
import { createProductClient } from './cms/actions/product';

export { createProductClient };

export const createProduct = async (formData: FormData) => {
    const product = Object.fromEntries(formData.entries()) as unknown as Product;
    product.price = Number(product.price);

    const response = await fetchGraphQL<Mutation>(CREATE_PRODUCT.loc?.source.body, {
        variables: {
            createProductInput: product
        }
    });
    return response.data.createProduct;
}

export const getProducts = async () => {
    const response = await fetchGraphQL<Query>(GET_PRODUCTS.loc?.source.body);

    if (response.errors && response.errors.length > 0) {
        return;
    }
    return response.data.products;
}

export const getProductIds = async () => {
    const response = await fetchGraphQL<Query>(GET_PRODUCT_IDS.loc?.source.body);

    if (response.errors && response.errors.length > 0) {
        return;
    }
    return response.data.products;
}

export const getProduct = async (id: string) => {
    const response = await fetchGraphQL<Query>(GET_PRODUCT.loc?.source.body, {variables: {id}});

    if (response.errors && response.errors.length > 0) {
        return;
    }
    return response.data.product;
}

export const getUsers = async () => {
    const response = await fetchGraphQL<Query>(GET_USERS.loc?.source.body);
    return response.data.users.map(user => ({
        id: user.id,
        username: user.username,
        provider: user.provider || 'local',
        settings: {
            userId: user.id,
            receiveEmails: false,
            receiveNotifications: false
        },
        posts: []
    })) as User[];
}
