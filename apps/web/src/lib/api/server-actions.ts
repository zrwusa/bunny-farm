'use server'

// apps/web/src/lib/api/actions.ts

import {fetchAuthGraphQL, fetchPublicGraphQL} from './server-graphql-fetch';
import {Mutation, Product, Query, User} from '@/types/generated/graphql';
import {
    CREATE_PRODUCT, GET_MY_ADDRESSES,
    GET_PRODUCT,
    GET_PRODUCT_IDS,
    GET_PRODUCTS, GET_SELECTED_CART_ITEMS,
    GET_USERS,
    ME_QUERY,
    SEARCH_PRODUCTS,
} from '@/lib/graphql';

export const createProduct = async (formData: FormData) => {
    const product = Object.fromEntries(formData.entries()) as unknown as Product;

    const response = await fetchAuthGraphQL<Mutation>(CREATE_PRODUCT.loc?.source.body, {
        variables: {
            createProductInput: product
        }
    });

    if (!response?.data) {
        throw new Error('Failed to create product');
    }
    return response.data.createProduct;
}

export const getProducts = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_PRODUCTS.loc?.source.body);

    if (!response?.data) {
        console.error('Error fetching products');
        return [];
    }
    return response.data.products ?? [];
}

export const getMe = async () => {
    const response = await fetchAuthGraphQL<Query>(ME_QUERY.loc?.source.body || '');
    return response.data?.me;
};

export const getProductIds = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_PRODUCT_IDS.loc?.source.body);

    if (!response?.data) {
        console.error('Error fetching product IDs');
        return [];
    }
    return response.data.products ?? [];
}

export const getProduct = async (id: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_PRODUCT.loc?.source.body, {variables: {id}});

    if (!response?.data) {
        console.error('Error fetching product');
        return null;
    }
    return response.data.product ?? null;
}

export const getUsers = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_USERS.loc?.source.body);

    if (!response?.data) {
        console.error('Error fetching users');
        return [];
    }

    const users = response.data.users ?? [];
    return users.map((user: User) => ({
        id: user.id,
        username: user.username,
        provider: user.provider ?? 'unknown',
        settings: {
            userId: user.id,
            receiveEmails: false,
            receiveNotifications: false
        },
        posts: []
    }));
}

export const searchProducts = async (keyword: string) => {
    const response = await fetchPublicGraphQL<Query>(SEARCH_PRODUCTS.loc?.source.body, {
        variables: {keyword}
    });

    if (!response?.data) {
        console.error('Error searching products');
        return [];
    }
    return response.data.searchProducts ?? [];
};



export const getMyAddresses = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_MY_ADDRESSES.loc?.source.body, {
        variables: {}
    });


    if (!response?.data) {
        console.error('Error getting my addresses');
        return [];
    }

    return response.data?.myAddresses ?? [];
}

export const getSelectedCartItems = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_SELECTED_CART_ITEMS.loc?.source.body, {
        variables: {}
    });

    if (!response?.data) {
        console.error('Error getting selected cart items');
        return [];
    }
    return response.data?.selectedCartItems ?? [];
}
