// File: apps/web/src/lib/api/server-actions.ts
'use server'

import { fetchAuthGraphQL, fetchPublicGraphQL } from './server-graphql-fetch';
import { Mutation, Product, Query, User } from '@/types/generated/graphql';
import {
    CREATE_PRODUCT,
    GET_MY_ADDRESSES,
    GET_PRODUCT,
    GET_PRODUCT_IDS,
    GET_PRODUCTS,
    GET_SELECTED_CART_ITEMS,
    GET_USERS,
    ME_QUERY,
    SEARCH_PRODUCTS,
} from '@/lib/graphql';


export const getProducts = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_PRODUCTS.loc?.source.body);
    

    return response.data?.products;
}

export const getMe = async () => {
    const response = await fetchAuthGraphQL<Query>(ME_QUERY.loc?.source.body || '');

    return response.data?.me;
};

export const getProductIds = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_PRODUCT_IDS.loc?.source.body);
    

    return response.data?.products;
}

export const getProduct = async (id: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_PRODUCT.loc?.source.body, { variables: { id } });
    
    return response.data?.product;
}

export const searchProducts = async (keyword: string) => {
    const response = await fetchPublicGraphQL<Query>(SEARCH_PRODUCTS.loc?.source.body, {
        variables: { keyword }
    });
    

    return response.data?.searchProducts;
};

export const getMyAddresses = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_MY_ADDRESSES.loc?.source.body, {
        variables: {}
    });
    

    return response.data?.myAddresses;
}

export const getSelectedCartItems = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_SELECTED_CART_ITEMS.loc?.source.body, {
        variables: {}
    });
    
    return response.data?.selectedCartItems;
}

export const createProduct = async (formData: FormData) => {
    // Convert form data into a product object
    const product = Object.fromEntries(formData.entries()) as unknown as Product;

    const response = await fetchAuthGraphQL<Mutation>(CREATE_PRODUCT.loc?.source.body, {
        variables: {
            createProductInput: product
        }
    });

    
    return response.data?.createProduct;
}

export const getUsers = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_USERS.loc?.source.body);
    

    const users = response.data?.users ?? [];
    // Map to a simplified user object with additional static fields for UI
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
