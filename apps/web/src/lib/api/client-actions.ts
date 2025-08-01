// File: apps/web/src/lib/api/client-actions.ts
'use client'

import {
    CreatePaymentIntentInput,
    CreateUserAddressInput,
    CreateUserInput,
    LoginInput,
    Mutation,
    PlaceOrderInput,
    Product,
    Query
} from '@/types/generated/graphql';
import { fetchAuthGraphQL } from './client-graphql-fetch';
import {
    ADD_MY_ADDRESS,
    CREATE_PAYMENT_INTENT,
    CREATE_PRODUCT_CLIENT,
    GET_ADDRESS_DETAIL,
    GET_MY_ADDRESSES,
    GET_ORDER,
    GET_SELECTED_CART_ITEMS,
    GOOGLE_LOGIN,
    LOCAL_LOGIN,
    LOGOUT,
    ME_QUERY,
    PLACE_ORDER,
    REGISTER
} from '@/lib/graphql';
import { setStoredTokens } from '../auth/client-auth';
import { handleGraphQLErrors } from './handle-graphql-errors';

// Keep handleGraphQLErrors: it propagates non-validation errors while allowing BAD_USER_INPUT and VALIDATION_FAILED
// to be handled by the UI (like form validation feedback).

export const createProductClient = async (prevState: Product, formData: FormData) => {
    // Merge form data into existing product state
    const formEntries = Object.fromEntries(formData.entries());
    const product = {
        ...prevState,
        ...formEntries,
        price: Number(formEntries.price)
    } as Product;

    const response = await fetchAuthGraphQL<Mutation>(CREATE_PRODUCT_CLIENT.loc?.source.body || '', {
        variables: {
            createProductInput: product
        }
    });

    handleGraphQLErrors(response);
    const { createProduct } = response.data || {};
    if (!createProduct?.id) return product; // If creation failed, return the temporary local product
    return createProduct;
}

export const getMe = async () => {
    const response = await fetchAuthGraphQL<Query>(ME_QUERY.loc?.source.body || '');
    handleGraphQLErrors(response);
    // Return current authenticated user information
    return response.data?.me;
};

export const googleLogin = async (loginInput: LoginInput) => {
    const response = await fetchAuthGraphQL<Mutation>(GOOGLE_LOGIN.loc?.source.body || '', {
        variables: { input: loginInput }
    });
    handleGraphQLErrors(response);
    return response.data?.login;
};

export const logout = async () => {
    const response = await fetchAuthGraphQL<Mutation>(LOGOUT.loc?.source.body || '');
    handleGraphQLErrors(response);
    if (response.data?.logout) {
        // Remove locally stored tokens after logout
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
    }
    return response.data?.logout;
};

export const register = async (createUserInput: CreateUserInput) => {
    const response = await fetchAuthGraphQL<Mutation>(REGISTER.loc?.source.body || '', {
        variables: { createUserInput }
    });
    handleGraphQLErrors(response);
    return response.data?.createUser;
};

export async function localLogin(email: string, password: string) {
        const response = await fetchAuthGraphQL<{ login: { accessToken: string; refreshToken: string } }>(
            LOCAL_LOGIN.loc?.source.body || '',
            {
                variables: {
                    input: {
                        email,
                        password,
                        type: 'local',
                    },
                },
            }
        );

        handleGraphQLErrors(response);
        if (response.data?.login) {
            // Save tokens after successful login
            await setStoredTokens(response.data.login.accessToken, response.data.login.refreshToken);
            return response.data.login;
        }
}

export const getSelectedCartItems = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_SELECTED_CART_ITEMS.loc?.source.body, {
        variables: {}
    });
    handleGraphQLErrors(response);
    return response.data?.selectedCartItems ?? [];
}

export const getMyAddresses = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_MY_ADDRESSES.loc?.source.body, {
        variables: {}
    });
    handleGraphQLErrors(response);
    return response.data?.myAddresses ?? [];
}

export const getAddressDetail = async (addressText: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_ADDRESS_DETAIL.loc?.source.body, {
        variables: {
            address: addressText
        }
    });
    handleGraphQLErrors(response);
    return response.data?.placeDetail;
}

export const addMyAddress = async (createUserAddressInput: CreateUserAddressInput) => {
    const response = await fetchAuthGraphQL<Mutation>(ADD_MY_ADDRESS.loc?.source.body, {
        variables: {
            input: createUserAddressInput
        }
    });
    handleGraphQLErrors(response);
    return response.data?.addMyAddress;
}

export const placeOrder = async (placeOrderInput: PlaceOrderInput) => {
    const response = await fetchAuthGraphQL<Mutation>(PLACE_ORDER.loc?.source.body, {
        variables: { placeOrderInput: placeOrderInput }
    });
    handleGraphQLErrors(response);
    return response.data?.placeOrder;
}

export const getOrder = async (id: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_ORDER.loc?.source.body, {
        variables: { id }
    });
    handleGraphQLErrors(response);
    return response.data?.order;
}

export const createPaymentIntent = async (createPaymentIntentInput: CreatePaymentIntentInput) => {
    const response = await fetchAuthGraphQL<Mutation>(CREATE_PAYMENT_INTENT.loc?.source.body, {
        variables: { createPaymentIntentInput: createPaymentIntentInput }
    });
    handleGraphQLErrors(response);
    return response.data?.createPaymentIntent;
}
