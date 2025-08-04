// apps/web/src/hooks/shopping/cart/useCart.ts

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
    AddItemToCartInput,
    Mutation,
    Query,
} from '@/types/generated/graphql';
import {
    ADD_ITEM_TO_CART,
    CLEAR_CART,
    GET_MY_CART,
    REMOVE_ITEM_FROM_CART,
    TOGGLE_ITEM_SELECTION,
    UPDATE_ITEM_QUANTITY,
} from '@/lib/graphql';
import { generateUuNumId } from '@bunny/shared';

export const useCart = () => {
    const [guestCartId, setGuestCartId] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);

    // Get or create guest cart ID
    useEffect(() => {
        let storedId = localStorage.getItem('GUEST_CART_ID');
        if (!storedId) {
            storedId = generateUuNumId();
            localStorage.setItem('GUEST_CART_ID', storedId);
        }
        setGuestCartId(storedId);
    }, []);

    // Fetch cart
    const {
        data,
        loading: cartLoading,
        error: cartError,
        refetch: fetchCart,
    } = useQuery<Query>(GET_MY_CART, {
        variables: { guestCartId },
        skip: !guestCartId,
        onCompleted: () => setInitialLoading(false),
    });

    const cart = data?.cart ?? null;

    // Mutations
    const [addItemToCartMutation] = useMutation<Mutation>(ADD_ITEM_TO_CART);
    const [clearCartMutation] = useMutation<Mutation>(CLEAR_CART);
    const [updateItemQuantityMutation] = useMutation<Mutation>(UPDATE_ITEM_QUANTITY);
    const [toggleItemSelectionMutation] = useMutation<Mutation>(TOGGLE_ITEM_SELECTION);
    const [removeFromCartMutation] = useMutation<Mutation>(REMOVE_ITEM_FROM_CART);

    const addToCart = useCallback(async (item: AddItemToCartInput['item']) => {
        if (!guestCartId) return;
            const { data } = await addItemToCartMutation({
                variables: { addItemToCartInput: { item, guestCartId } },
            });
            return data?.addToCart ?? null;
    }, [addItemToCartMutation, guestCartId]);

    const clearCartItems = useCallback(async (cartId: string) => {
            const { data } = await clearCartMutation({ variables: { id: cartId } });
            return data?.clearCart ?? null;
    }, [clearCartMutation]);

    const updateCartItemQuantity = useCallback(async (skuId: string, quantity: number) => {
            const { data } = await updateItemQuantityMutation({
                variables: { updateItemQuantityInput: { skuId, quantity } },
            });
            return data?.updateItemQuantity ?? null;
    }, [updateItemQuantityMutation]);

    const toggleItemSelection = useCallback(async (skuId: string, selected: boolean) => {
            const { data } = await toggleItemSelectionMutation({
                variables: { toggleItemSelectionInput: { skuId, selected } },
            });
            return data?.toggleItemSelection ?? null;
    }, [toggleItemSelectionMutation]);

    const removeFromCart = useCallback(async (itemId: string) => {
        if (!cart) return;
            const updatedItems = cart.items.filter(item => item.id === itemId);
            const { data } = await removeFromCartMutation({
                variables: {
                    removeItemsInput: {
                        skuIds: updatedItems.map(item => item.skuId),
                    },
                },
            });
            return data?.removeItems ?? null;
    }, [cart, removeFromCartMutation]);

    return {
        cart,
        loading: cartLoading || initialLoading,
        error: cartError,
        fetchCart,
        addToCart,
        clearCartItems,
        updateCartItemQuantity,
        toggleItemSelection,
        removeFromCart,
    };
};
