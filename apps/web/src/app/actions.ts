'use server'

import {Product, User} from '@/store/app';
import {objToGraphQLString} from '@/utils';
import {fetchGraphQL, GraphQLResponse} from '@/lib/graphql-fetch';
import {LoginInput, Mutation, Query} from '@/types/generated/graphql';
import {GET_PRODUCT, GET_PRODUCTS, GET_PRODUCT_IDS, GET_USERS} from '@/lib/graphql/queries';
import {CREATE_PRODUCT} from '@/lib/graphql/mutations';

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

export const createProductASCC = async (prevState: Product, formData: FormData) => {
    const product = {...prevState, ...Object.fromEntries(formData.entries())} as Product;
    product.price = Number(product.price);

    const response = await fetchGraphQL<Mutation>(CREATE_PRODUCT.loc?.source.body, {
        variables: {
            createProductInput: product
        }
    });

    if (response.errors && response.errors.length > 0) {
        return product;
    }
    const {createProduct} = response.data;
    if (createProduct.id) return createProduct
    return product;
}

export const getProducts = async () => {
    const response = await fetchGraphQL<Query>(GET_PRODUCTS.loc?.source.body);
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