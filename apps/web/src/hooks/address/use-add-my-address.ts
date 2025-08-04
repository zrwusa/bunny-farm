// File: apps/web/src/hooks/address/useAddMyAddress.ts

import { useMutation } from '@apollo/client';
import { ADD_MY_ADDRESS } from '@/lib/graphql';
import { AddMyAddressMutation } from '@/types/generated/graphql';

export function useAddMyAddress() {
    return useMutation<AddMyAddressMutation>(ADD_MY_ADDRESS);
}
