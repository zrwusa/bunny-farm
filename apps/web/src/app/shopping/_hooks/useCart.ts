'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {AddItemToCartInput, CartItem} from '@/types/generated/graphql';
import { RootState } from '@/store/store';
import {
  setCartSession,
  setLoading,
  setError,
} from '@/store/slices/cartSlice';
import { GET_MY_CART } from '@/lib/graphql/queries';
import {UPDATE_ITEM_QUANTITY, CLEAR_CART, REMOVE_ITEM_FROM_CART} from '@/lib/graphql/mutations';
import { fetchGraphQL } from '@/lib/api/graphql-fetch';
import { Query, Mutation } from '@/types/generated/graphql';
import {ADD_ITEM_TO_CART} from '@/lib/graphql/mutations';

const handleError = (error: unknown, dispatch: any) => {
  let errorMessage = 'An unexpected error occurred';

  if (error instanceof Error) {
    if (error.message.includes('Either userId or clientCartId must be provided')) {
      errorMessage = 'Please provide a session ID for guest cart';
    } else {
      errorMessage = error.message;
    }
  }

  dispatch(setError(errorMessage));
  return null;
};

export const useCart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state: RootState) => state.cart);
  const isFetching = useRef(false);
  const [clientCartId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Generate or retrieve session ID
    let storedSessionId = localStorage.getItem('clientCartId');
    if (!storedSessionId) {
      storedSessionId = Math.random().toString(36).substring(2);
      localStorage.setItem('clientCartId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const fetchCart = useCallback(async () => {
    if (isFetching.current || !clientCartId) return;

    isFetching.current = true;
    try {
      const response = await fetchGraphQL<Query>(GET_MY_CART.loc?.source.body, {
        variables: { clientCartId },
      });
      if (response?.data?.cart) {
        dispatch(setCartSession(response.data.cart));
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      isFetching.current = false;
    }
  }, [dispatch, clientCartId]);

  useEffect(() => {
    if (!cart && clientCartId) {
      fetchCart();
    }
  }, [cart, fetchCart, clientCartId]);

  const updateCart = useCallback(async (cartId: string, items: CartItem[]) => {
    try {
      const response = await fetchGraphQL<Mutation>(UPDATE_ITEM_QUANTITY.loc?.source.body, {
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
      if (response?.data?.updateItemQuantity) {
        dispatch(setCartSession(response.data.updateItemQuantity));
        return response.data.updateItemQuantity;
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
      if (response?.data?.clearCart) {
        dispatch(setCartSession(response.data.clearCart));
        return response.data.clearCart;
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch]);

  const addToCart = useCallback(async (item: AddItemToCartInput["item"]) => {
    if (!clientCartId) {
      dispatch(setError('Client Cart ID is required for guest cart'));
      return null;
    }

    try {
      // If cart exists, update it
      if (cart) {
        const response = await fetchGraphQL<Mutation>(ADD_ITEM_TO_CART.loc?.source.body, {
          variables: {
            addItemToCartInput: {
              item,
              clientCartId
            }
          },
        });
        if (response?.data?.addToCart) {
          dispatch(setCartSession(response.data.addToCart));
          return response.data.addToCart;
        }
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch, clientCartId, cart]);

  const updateCartItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!cart) return;

      dispatch(setLoading(true));
      try {
        const updatedItems = cart.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );

        const updatedCart = await updateCart(cart.id, updatedItems);
        if (!updatedCart) throw new Error('Failed to update cart item quantity');
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cart, updateCart, dispatch]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!cart) return;

      dispatch(setLoading(true));
      try {
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const response = await fetchGraphQL<Mutation>(REMOVE_ITEM_FROM_CART.loc?.source.body, {
          variables: {
            removeItemsInput: {
              skuIds: updatedItems.map(item => (item.skuId)),
            },
          },
        });
        if (response?.data?.removeItems) {
          dispatch(setCartSession(response.data.removeItems));
        } else {
          throw new Error('Failed to remove item from cart');
        }
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cart, dispatch]
  );

  return {
    cart,
    loading,
    error,
    addToCart,
    fetchCart,
    clearCartItems,
    updateCartItemQuantity,
    removeFromCart,
  };
};