'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartSession } from '@/types/generated/graphql';
import { RootState } from '@/store/store';
import {
  setCartSession,
  setLoading,
  setError,
  clearCart,
} from '@/store/slices/cartSlice';
import { GET_MY_CART, CREATE_CART, UPDATE_CART, CLEAR_CART } from '@/lib/graphql/queries';
import { fetchGraphQL } from '@/lib/api/graphql-fetch';
import { Query, Mutation } from '@/types/generated/graphql';

// Define a local CartItem type with necessary fields
export interface LocalCartItem {
  id: string;
  productId: string;
  skuId: string;
  quantity: number;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
}

const handleError = (error: unknown, dispatch: any) => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  dispatch(setError(errorMessage));
  return null;
};

export const useCart = () => {
  const dispatch = useDispatch();
  const { cartSession, loading, error } = useSelector((state: RootState) => state.cart);

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetchGraphQL<Query>(GET_MY_CART.loc?.source.body);
      if (response.data.myCart) {
        dispatch(setCartSession(response.data.myCart));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const createCart = useCallback(async (productId: string, skuId: string, quantity: number) => {
    try {
      const response = await fetchGraphQL<Mutation>(CREATE_CART.loc?.source.body, {
        variables: {
          createCartInput: {
            items: [{ productId, skuId, quantity }],
          },
        },
      });
      if (response.data.createCart) {
        dispatch(setCartSession(response.data.createCart));
        return response.data.createCart;
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch]);

  const updateCart = useCallback(async (cartId: string, items: LocalCartItem[]) => {
    try {
      const response = await fetchGraphQL<Mutation>(UPDATE_CART.loc?.source.body, {
        variables: {
          updateCartInput: {
            id: cartId,
            items: items.map(item => ({
              productId: item.productId,
              skuId: item.skuId,
              quantity: item.quantity,
            })),
          },
        },
      });
      if (response.data.updateCart) {
        dispatch(setCartSession(response.data.updateCart));
        return response.data.updateCart;
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch]);

  const clearCartItems = useCallback(async (cartId: string) => {
    try {
      const response = await fetchGraphQL<Mutation>(CLEAR_CART.loc?.source.body, {
        variables: { id: cartId },
      });
      if (response.data.clearCart) {
        dispatch(setCartSession(response.data.clearCart));
        return response.data.clearCart;
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch]);

  const addToCart = useCallback(
    async (productId: string, skuId: string, quantity: number) => {
      dispatch(setLoading(true));
      try {
        if (!cartSession) {
          const newCart = await createCart(productId, skuId, quantity);
          if (!newCart) throw new Error('Failed to create cart');
        } else {
          const existingItem = cartSession.items.find(
            item => item.productId === productId && item.skuId === skuId
          );

          const updatedItems = existingItem
            ? cartSession.items.map(item =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            : [...cartSession.items, {
                id: '',
                productId,
                skuId,
                quantity,
                selected: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }];

          const updatedCart = await updateCart(cartSession.id, updatedItems);
          if (!updatedCart) throw new Error('Failed to update cart');
        }
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cartSession, createCart, updateCart, dispatch]
  );

  const updateCartItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!cartSession) return;

      dispatch(setLoading(true));
      try {
        const updatedItems = cartSession.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );

        const updatedCart = await updateCart(cartSession.id, updatedItems);
        if (!updatedCart) throw new Error('Failed to update cart item quantity');
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cartSession, updateCart, dispatch]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!cartSession) return;

      dispatch(setLoading(true));
      try {
        const updatedItems = cartSession.items.filter(item => item.id !== itemId);
        const updatedCart = await updateCart(cartSession.id, updatedItems);
        if (!updatedCart) throw new Error('Failed to remove item from cart');
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cartSession, updateCart, dispatch]
  );

  return {
    cartSession,
    loading,
    error,
    addToCart,
    fetchCart,
    clearCartItems,
    updateCartItemQuantity,
    removeFromCart,
  };
};