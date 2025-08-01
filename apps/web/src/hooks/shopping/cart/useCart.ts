// apps/web/src/hooks/shopping/cart/useCart.ts

'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AddItemToCartInput, Mutation, Query} from '@/types/generated/graphql';
import {RootState} from '@/store/store';
import {setCartSession, setError, setLoading,} from '@/store/slices/cartSlice';
import {Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {
    ADD_ITEM_TO_CART,
    CLEAR_CART,
    GET_MY_CART,
    REMOVE_ITEM_FROM_CART,
    TOGGLE_ITEM_SELECTION,
    UPDATE_ITEM_QUANTITY,
} from '@/lib/graphql';
import {fetchAuthGraphQL} from '@/lib/api/client-graphql-fetch';
import * as Sentry from '@sentry/nextjs';

const dispatchError = (error: unknown, dispatch: Dispatch<PayloadAction<string>>) => {
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Error) {
        errorMessage = error.message;
        Sentry.captureException(error);
    } else {
        Sentry.captureMessage(String(error));
    }

    dispatch(setError(errorMessage));
    return null;
};

// Shared helper for GraphQL operations
const handleGraphQLRequest = async <T>(
    query: string | undefined,
    variables: Record<string, unknown>,
    dispatch: Dispatch<PayloadAction<string>>,
    onSuccess?: (data: T) => void,
    setLocalLoading?: (loading: boolean) => void,
) => {
    try {
        if (setLocalLoading) setLocalLoading(true);
        const response = await fetchAuthGraphQL<T>(query, {variables});
        if (onSuccess && response?.data) {
            onSuccess(response.data);
        }
        return response?.data ?? null;
    } catch (error) {
        return dispatchError(error, dispatch);
    } finally {
        if (setLocalLoading) setLocalLoading(false);
    }
};

export const useCart = () => {
    const dispatch = useDispatch();
    const {cart, loading, error} = useSelector((state: RootState) => state.cart);

    const [initialLoading, setInitialLoading] = useState(true);
    const [clientCartId, setClientCartId] = useState<string | null>(null);

    const isFetching = useRef(false);

    useEffect(() => {
        // Generate or retrieve cart ID
        let storedId = localStorage.getItem('clientCartId');
        if (!storedId) {
            storedId = Math.random().toString(36).substring(2);
            localStorage.setItem('clientCartId', storedId);
        }
        setClientCartId(storedId);
    }, []);

    const fetchCart = useCallback(async () => {
        if (isFetching.current || !clientCartId) return;
        isFetching.current = true;

        await handleGraphQLRequest<Query>(
            GET_MY_CART.loc?.source.body,
            {clientCartId},
            dispatch,
            (data) => {
                if (data.cart) {
                    dispatch(setCartSession(data.cart));
                }
            },
            setInitialLoading, // use local loading
        );

        isFetching.current = false;
    }, [clientCartId, dispatch]);

    useEffect(() => {
        if (!cart && clientCartId) {
            fetchCart();
        } else {
            setInitialLoading(false); // fallback
        }
    }, [cart, fetchCart, clientCartId]);

    const clearCartItems = useCallback(async (cartId: string) => {
        return handleGraphQLRequest<Mutation>(
            CLEAR_CART.loc?.source.body,
            {id: cartId},
            dispatch,
            (data) => {
                if (data.clearCart) {
                    dispatch(setCartSession(data.clearCart));
                }
            },
        );
    }, [dispatch]);

    const addToCart = useCallback(async (item: AddItemToCartInput['item']) => {
        if (!clientCartId) {
            dispatch(setError('Client Cart ID is required for guest cart'));
            return null;
        }

        return handleGraphQLRequest<Mutation>(
            ADD_ITEM_TO_CART.loc?.source.body,
            {addItemToCartInput: {item, clientCartId}},
            dispatch,
            (data) => {
                if (data.addToCart) {
                    dispatch(setCartSession(data.addToCart));
                }
            },
        );
    }, [clientCartId, dispatch]);

    const updateCartItemQuantity = useCallback(async (skuId: string, quantity: number) => {
        if (!cart) return;

        return handleGraphQLRequest<Mutation>(
            UPDATE_ITEM_QUANTITY.loc?.source.body,
            {updateItemQuantityInput: {skuId, quantity}},
            dispatch,
            (data) => {
                if (data.updateItemQuantity) {
                    dispatch(setCartSession(data.updateItemQuantity));
                }
            },
        );
    }, [cart, dispatch]);

    const toggleItemSelection = useCallback(async (skuId: string, selected: boolean) => {
        if (!cart) return;

        return handleGraphQLRequest<Mutation>(
            TOGGLE_ITEM_SELECTION.loc?.source.body,
            {toggleItemSelectionInput: {skuId, selected}},
            dispatch,
            (data) => {
                if (data.toggleItemSelection) {
                    dispatch(setCartSession(data.toggleItemSelection));
                }
            },
        );
    }, [cart, dispatch]);

    const removeFromCart = useCallback(async (itemId: string) => {
        if (!cart) return;

        dispatch(setLoading(true));
        const updatedItems = cart.items.filter(item => item.id == itemId);
        try {
            const response = await fetchAuthGraphQL<Mutation>(
                REMOVE_ITEM_FROM_CART.loc?.source.body,
                {
                    variables: {
                        removeItemsInput: {
                            skuIds: updatedItems.map(item => item.skuId),
                        },
                    },
                },
            );
            if (response?.data?.removeItems) {
                dispatch(setCartSession(response.data.removeItems));
            } else {
                throw new Error('Failed to remove item from cart');
            }
        } catch (error) {
            dispatchError(error, dispatch);
        } finally {
            dispatch(setLoading(false));
        }
    }, [cart, dispatch]);

    return {
        cart,
        loading: loading || initialLoading,
        error,
        addToCart,
        fetchCart,
        clearCartItems,
        updateCartItemQuantity,
        toggleItemSelection,
        removeFromCart,
    };
};
