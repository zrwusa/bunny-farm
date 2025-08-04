// File: @/hooks/address/useAddressDetail.ts
'use client'

import { useLazyQuery } from '@apollo/client';
import { GET_ADDRESS_DETAIL } from '@/lib/graphql';
import {PlaceDetailQuery} from '@/types/generated/graphql';

/**
 * useAddressDetail hook
 * Lazy GraphQL query to get structured address info from a raw address string.
 */
export const useAddressDetail = () =>
    useLazyQuery<PlaceDetailQuery>(GET_ADDRESS_DETAIL);
