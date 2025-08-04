// File: apps/web/src/hooks/order/usePlaceOrder.ts

import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from '@/lib/graphql';
import {PlaceOrderMutation} from '@/types/generated/graphql';

export function usePlaceOrder() {
    return useMutation<PlaceOrderMutation>(
        PLACE_ORDER
    );
}
