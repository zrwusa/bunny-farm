// File: @/hooks/payment/useCreatePaymentIntent.ts
'use client';

import {useMutation} from '@apollo/client';
import {CREATE_PAYMENT_INTENT} from '@/lib/graphql';
import {CreatePaymentIntentMutation} from '@/types/generated/graphql';

export const useCreatePaymentIntent = () =>
    useMutation<CreatePaymentIntentMutation>(CREATE_PAYMENT_INTENT);
