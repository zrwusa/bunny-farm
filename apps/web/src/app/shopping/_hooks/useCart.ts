'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartSession, CartItem } from '@/types/generated/graphql';
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

const handleError = (error: unknown, dispatch: any) => {
  let errorMessage = 'An unexpected error occurred';

  if (error instanceof Error) {
    if (error.message.includes('Either userId or sessionId must be provided')) {
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
  const { cartSession, loading, error } = useSelector((state: RootState) => state.cart);
  const isFetching = useRef(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Generate or retrieve session ID
    let storedSessionId = localStorage.getItem('cartSessionId');
    if (!storedSessionId) {
      storedSessionId = Math.random().toString(36).substring(2);
      localStorage.setItem('cartSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const fetchCart = useCallback(async () => {
    if (isFetching.current || !sessionId) return;

    isFetching.current = true;
    try {
      const response = await fetchGraphQL<Query>(GET_MY_CART.loc?.source.body, {
        variables: { sessionId },
      });
      if (response?.data?.myCart) {
        dispatch(setCartSession(response.data.myCart));
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      isFetching.current = false;
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (!cartSession && sessionId) {
      fetchCart();
    }
  }, [cartSession, fetchCart, sessionId]);

  const createCart = useCallback(async (productId: string, skuId: string, quantity: number) => {
    if (!sessionId) {
      dispatch(setError('Session ID is required for guest cart'));
      return null;
    }

    try {
      const response = await fetchGraphQL<Mutation>(CREATE_CART.loc?.source.body, {
        variables: {
          createCartInput: {
            items: [{ productId, skuId, quantity }],
          },
          sessionId,
        },
      });
      if (response?.data?.createCart) {
        dispatch(setCartSession(response.data.createCart));
        return response.data.createCart;
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch, sessionId]);

  const updateCart = useCallback(async (cartId: string, items: CartItem[]) => {
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
      if (response?.data?.updateCart) {
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
      if (response?.data?.clearCart) {
        dispatch(setCartSession(response.data.clearCart));
        return response.data.clearCart;
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch]);

  const addToCart = useCallback(async (productId: string, skuId: string, quantity: number) => {
    if (!sessionId) {
      dispatch(setError('Session ID is required for guest cart'));
      return null;
    }

    try {
      // If cart exists, update it
      if (cartSession) {
        const existingItem = cartSession.items.find(
          item => item.productId === productId && item.skuId === skuId
        );

        const updatedItems = existingItem
          ? cartSession.items.map(item =>
              item.id === existingItem.id
                ? { productId: item.productId, skuId: item.skuId, quantity: item.quantity + quantity }
                : { productId: item.productId, skuId: item.skuId, quantity: item.quantity }
            )
          : [...cartSession.items.map(item => ({
              productId: item.productId,
              skuId: item.skuId,
              quantity: item.quantity
            })), {
              productId,
              skuId,
              quantity
            }];

        const response = await fetchGraphQL<Mutation>(CREATE_CART.loc?.source.body, {
          variables: {
            createCartInput: {
              items: updatedItems,
            },
            sessionId,
          },
        });
        if (response?.data?.createCart) {
          dispatch(setCartSession(response.data.createCart));
          return response.data.createCart;
        }
      } else {
        // Create new cart
        const response = await fetchGraphQL<Mutation>(CREATE_CART.loc?.source.body, {
          variables: {
            createCartInput: {
              items: [{ productId, skuId, quantity }],
            },
            sessionId,
          },
        });
        if (response?.data?.createCart) {
          dispatch(setCartSession(response.data.createCart));
          return response.data.createCart;
        }
      }
      return null;
    } catch (error) {
      return handleError(error, dispatch);
    }
  }, [dispatch, sessionId, cartSession]);

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
        const response = await fetchGraphQL<Mutation>(UPDATE_CART.loc?.source.body, {
          variables: {
            updateCartInput: {
              id: cartSession.id,
              items: updatedItems.map(item => ({
                productId: item.productId,
                skuId: item.skuId,
                quantity: item.quantity,
              })),
            },
          },
        });
        if (response?.data?.updateCart) {
          dispatch(setCartSession(response.data.updateCart));
        } else {
          throw new Error('Failed to remove item from cart');
        }
      } catch (error) {
        handleError(error, dispatch);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cartSession, dispatch]
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