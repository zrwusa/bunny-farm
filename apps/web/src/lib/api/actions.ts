'use server'

import {fetchGraphQL, fetchGraphQLPure} from './graphql-fetch';
import { Product } from '@/types/generated/graphql';
import { Mutation, Query, User } from '@/types/generated/graphql';
import {
    GET_PRODUCT,
    GET_PRODUCTS,
    GET_PRODUCT_IDS,
    GET_USERS,
    SEARCH_PRODUCTS,
} from '@/lib/graphql/queries';
import { CREATE_PRODUCT } from '@/lib/graphql/mutations';

export const createProduct = async (formData: FormData) => {
    const product = Object.fromEntries(formData.entries()) as unknown as Product;

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

    if (!response?.data) {
        console.error('Error fetching products');
        return [];
    }
    return response.data.products ?? [];
}

export const getProductIds = async () => {
    const response = await fetchGraphQL<Query>(GET_PRODUCT_IDS.loc?.source.body);

    if (!response?.data) {
        console.error('Error fetching product IDs');
        return [];
    }
    return response.data.products ?? [];
}

export const getProduct = async (id: string) => {
    const response = await fetchGraphQL<Query>(GET_PRODUCT.loc?.source.body, { variables: { id } });

    if (!response?.data) {
        console.error('Error fetching product');
        return null;
    }
    return response.data.product ?? null;
}

export const getUsers = async () => {
    const response = await fetchGraphQL<Query>(GET_USERS.loc?.source.body);

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
    const response = await fetchGraphQLPure<Query>(SEARCH_PRODUCTS.loc?.source.body, {
        variables: { keyword }
    });

    if (!response?.data) {
        console.error('Error searching products');
        return [];
    }
    return response.data.searchProducts ?? [];
};
