'use server'

import { fetchGraphQL } from './graphql-fetch';
import { Product } from '@/types/generated/graphql';
import { Mutation, Query, User } from '@/types/generated/graphql';
import { GET_PRODUCT, GET_PRODUCTS, GET_PRODUCT_IDS, GET_USERS, SEARCH_PRODUCTS } from '@/lib/graphql/queries';
import { CREATE_PRODUCT } from '@/lib/graphql/mutations';
import { createProductClient } from './client-actions';

export { createProductClient };

export const createProduct = async (formData: FormData) => {
    const product = Object.fromEntries(formData.entries()) as unknown as Product;
    product.price = Number(product.price);

    const response = await fetchGraphQL<Mutation>(CREATE_PRODUCT.loc?.source.body, {
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
    const response = await fetchGraphQL<Query>(GET_PRODUCTS.loc?.source.body);

    if (!response?.data || response.errors?.length) {
        console.error('Error fetching products:', response.errors);
        return [];
    }
    return response.data.products ?? [];
}

export const getProductIds = async () => {
    const response = await fetchGraphQL<Query>(GET_PRODUCT_IDS.loc?.source.body);

    if (!response?.data || response.errors?.length) {
        console.error('Error fetching product IDs:', response.errors);
        return [];
    }
    return response.data.products ?? [];
}

export const getProduct = async (id: string) => {
    const response = await fetchGraphQL<Query>(GET_PRODUCT.loc?.source.body, {variables: {id}});

    if (!response?.data || response.errors?.length) {
        console.error('Error fetching product:', response.errors);
        return null;
    }
    return response.data.product ?? null;
}

export const getUsers = async () => {
    const response = await fetchGraphQL<Query>(GET_USERS.loc?.source.body);

    if (!response?.data || response.errors?.length) {
        console.error('Error fetching users:', response.errors);
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
    const response = await fetchGraphQL<Query>(SEARCH_PRODUCTS.loc?.source.body, {
        variables: { keyword }
    });

    if (!response?.data || response.errors?.length) {
        console.error('Error searching products:', response.errors);
        return [];
    }
    return response.data.searchProducts ?? [];
};
