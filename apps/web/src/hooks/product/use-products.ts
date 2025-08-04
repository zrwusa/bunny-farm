// File: @/hooks/product/useProducts.ts
'use client';

import {useQuery} from '@apollo/client';
import {GET_PRODUCTS} from '@/lib/graphql';
import {GetProductsQuery} from '@/types/generated/graphql';

/**
 * useProducts hook
 * Fetches the list of products using Apollo Client's useQuery.
 */
export const useProducts = () => {
    return useQuery<GetProductsQuery>(GET_PRODUCTS);
};
