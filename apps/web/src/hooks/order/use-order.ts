// File: @/hooks/order/useOrder.ts
'use client';

import { useQuery } from '@apollo/client';
import { GET_ORDER } from '@/lib/graphql';
import {GetOrderQuery} from '@/types/generated/graphql';

/**
 * useOrder hook
 * Fetches order data by ID
 */
export const useOrder = (id: string) =>
    useQuery<GetOrderQuery>(GET_ORDER, {
        variables: { id },
        skip: !id, // skip query if id is falsy
    });
