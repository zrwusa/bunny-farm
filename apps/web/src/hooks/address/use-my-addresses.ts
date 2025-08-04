// File: apps/web/src/hooks/address/useMyAddresses.ts

import { useQuery } from '@apollo/client';
import { GET_MY_ADDRESSES } from '@/lib/graphql';
import {GetMyAddressesQuery} from '@/types/generated/graphql';

export function useMyAddresses({
                                   initialData,
                               }: { initialData?: GetMyAddressesQuery }) {
    return useQuery<GetMyAddressesQuery>(GET_MY_ADDRESSES, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        ...(initialData && { initialData }),
    });
}

