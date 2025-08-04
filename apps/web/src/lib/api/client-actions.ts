// File: apps/web/src/lib/api/client-actions.ts
'use client'

import {Mutation, Product} from '@/types/generated/graphql';
import {fetchAuthGraphQL} from './client-graphql-fetch';
import {CREATE_PRODUCT_CLIENT} from '@/lib/graphql';

// Keep clientHandleGraphqlErrorsUiConvention: it propagates non-validation errors while allowing BAD_USER_INPUT and VALIDATION_FAILED
// to be handled by the UI (like form validation feedback).

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