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
import {fetchAuthGraphQL} from './client-graphql-fetch';
import {
    ADD_MY_ADDRESS,
    CREATE_PAYMENT_INTENT,
    CREATE_PRODUCT_CLIENT,
    GET_ADDRESS_DETAIL,
    GET_MY_ADDRESSES,
    GET_ORDER,
    GET_PRODUCTS,
    GET_SELECTED_CART_ITEMS,
    GOOGLE_LOGIN,
    LOCAL_LOGIN,
    LOGOUT,
    ME_QUERY,
    PLACE_ORDER,
    REGISTER
} from '@/lib/graphql';
import {setStoredTokens} from '../auth/client-auth';

// Keep clientHandleGraphqlErrorsUiConvention: it propagates non-validation errors while allowing BAD_USER_INPUT and VALIDATION_FAILED
// to be handled by the UI (like form validation feedback).

export const getProductsViaClient = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_PRODUCTS.loc?.source.body);


    return response;
}
export const createProductViaClient = async (prevState: Product, formData: FormData) => {
    // Merge form data into existing product state
    const formEntries = Object.fromEntries(formData.entries());
    const product = {
        ...prevState,
        ...formEntries,
        price: Number(formEntries.price)
    } as Product;

    const response = await fetchAuthGraphQL<Mutation>(CREATE_PRODUCT_CLIENT.loc?.source.body, {
        variables: {
            createProductInput: product
        }
    });

    const {createProduct} = response.data || {};
    if (!createProduct?.id) return product; // If creation failed, return the temporary local product
    return createProduct;
}

export const getMeViaClient = async () => {
    const response = await fetchAuthGraphQL<Query>(ME_QUERY.loc?.source.body);
    return response.data?.me;
};

export const googleLoginViaClient = async (loginInput: LoginInput) => {
    const response = await fetchAuthGraphQL<Mutation>(GOOGLE_LOGIN.loc?.source.body, {
        variables: {input: loginInput}
    });

    return response.data?.login;
};

export const logoutViaClient = async () => {
    const response = await fetchAuthGraphQL<Mutation>(LOGOUT.loc?.source.body);

    if (response.data?.logout) {
        // Remove locally stored tokens after logout
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
    }
    return response.data?.logout;
};

export const registerViaClient = async (createUserInput: CreateUserInput) => {
    const response = await fetchAuthGraphQL<Mutation>(REGISTER.loc?.source.body, {
        variables: {createUserInput}
    });

    return response.data?.createUser;
};

export const localLoginViaClient = async (email: string, password: string) => {
    const response = await fetchAuthGraphQL<Mutation>(LOCAL_LOGIN.loc?.source.body, {
        variables: {
            input: {
                email,
                password,
                type: 'local',
            },
        },
    });

    if (response.data?.login) {
        // Save tokens after successful login
        await setStoredTokens(response.data.login.accessToken, response.data.login.refreshToken);
        return response.data.login;
    }
};

export const getSelectedCartItemsViaClient = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_SELECTED_CART_ITEMS.loc?.source.body, {
        variables: {}
    });

    return response.data?.selectedCartItems;
};

export const getMyAddressesViaClient = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_MY_ADDRESSES.loc?.source.body, {
        variables: {}
    });

    return response.data?.myAddresses;
};

export const getAddressDetailViaClient = async (addressText: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_ADDRESS_DETAIL.loc?.source.body, {
        variables: {
            address: addressText
        }
    });

    return response.data?.placeDetail;
};

export const addMyAddressViaClient = async (createUserAddressInput: CreateUserAddressInput) => {
    const response = await fetchAuthGraphQL<Mutation>(ADD_MY_ADDRESS.loc?.source.body, {
        variables: {
            input: createUserAddressInput
        }
    });

    return response;
};

export const placeOrderViaClient = async (placeOrderInput: PlaceOrderInput) => {
    const response = await fetchAuthGraphQL<Mutation>(PLACE_ORDER.loc?.source.body, {
        variables: {
            placeOrderInput: placeOrderInput
        }
    });

    return response.data?.placeOrder;
};

export const getOrderViaClient = async (id: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_ORDER.loc?.source.body, {
        variables: {
            id
        }
    });

    return response.data?.order;
};

export const createPaymentIntentViaClient = async (createPaymentIntentInput: CreatePaymentIntentInput) => {
    const response = await fetchAuthGraphQL<Mutation>(CREATE_PAYMENT_INTENT.loc?.source.body, {
        variables: {
            createPaymentIntentInput: createPaymentIntentInput
        }
    });

    return response.data?.createPaymentIntent;
};

