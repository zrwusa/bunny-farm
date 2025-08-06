
'use client';

import {useMutation} from '@apollo/client';
import {CREATE_PRODUCT_CLIENT} from '@/lib/graphql';
import {CreateProductClientMutation, CreateProductClientMutationVariables} from '@/types/generated/graphql';

export const useCreateProduct = () => {
    return useMutation<CreateProductClientMutation, CreateProductClientMutationVariables>(
        CREATE_PRODUCT_CLIENT
    );
};