'use client';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartItem, CartSession } from '../_types/cart';
import { RootState } from '@/store/store';
import {
  setCartSession,
  setLoading,
  setError,
  clearCart,
} from '@/store/slices/cartSlice';
import { GET_MY_CART, CREATE_CART, UPDATE_CART, CLEAR_CART } from '@/lib/graphql/cart';
import { fetchGraphQL, GraphQLResponse } from '@/lib/graphql-fetch';
import { Query, Mutation } from '@/types/generated/graphql';

export const useCart = () => {
  const dispatch = useDispatch();
  const { cartSession, loading, error } = useSelector((state: RootState) => state.cart);

  // 获取购物车数据
  const fetchCart = useCallback(async () => {
    try {
      const response = await fetchGraphQL<Query>(GET_MY_CART.loc?.source.body);
      if (response.data.myCart) {
        dispatch(setCartSession(response.data.myCart));
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : '获取购物车失败'));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 创建购物车
  const createCart = useCallback(async (productId: string, skuId: string, quantity: number) => {
    try {
      const response = await fetchGraphQL<Mutation>(CREATE_CART.loc?.source.body, {
        variables: {
          createCartInput: {
            items: [{
              productId,
              skuId,
              quantity,
              id: '', // 新项目不需要 id
            }],
          },
        },
      });
      if (response.data.createCart) {
        dispatch(setCartSession(response.data.createCart));
        return response.data.createCart;
      }
      return null;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : '创建购物车失败'));
      return null;
    }
  }, [dispatch]);

  // 更新购物车
  const updateCart = useCallback(async (cartId: string, items: CartItem[]) => {
    try {
      const response = await fetchGraphQL<Mutation>(UPDATE_CART.loc?.source.body, {
        variables: {
          updateCartInput: {
            id: cartId,
            items: items.map(item => ({
              id: item.id || '',
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
      dispatch(setError(error instanceof Error ? error.message : '更新购物车失败'));
      return null;
    }
  }, [dispatch]);

  // 清空购物车
  const clearCartItems = useCallback(async (cartId: string) => {
    try {
      const response = await fetchGraphQL<Mutation>(CLEAR_CART.loc?.source.body, {
        variables: {
          id: cartId,
        },
      });
      if (response.data.clearCart) {
        dispatch(setCartSession(response.data.clearCart));
        return response.data.clearCart;
      }
      return null;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : '清空购物车失败'));
      return null;
    }
  }, [dispatch]);

  // 添加商品到购物车
  const addToCart = useCallback(
    async (productId: string, skuId: string, quantity: number) => {
      dispatch(setLoading(true));
      try {
        if (!cartSession) {
          const newCart = await createCart(productId, skuId, quantity);
          if (!newCart) {
            throw new Error('创建购物车失败');
          }
        } else {
          const existingItem = cartSession.items.find(
            (item: CartItem) => item.productId === productId && item.skuId === skuId
          );

          const updatedItems = existingItem
            ? cartSession.items.map((item: CartItem) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            : [...cartSession.items, { id: '', productId, skuId, quantity }];

          const updatedCart = await updateCart(cartSession.id, updatedItems);
          if (!updatedCart) {
            throw new Error('更新购物车失败');
          }
        }
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : '添加商品失败'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [cartSession, createCart, updateCart, dispatch]
  );

  return {
    cartSession,
    loading,
    error,
    addToCart,
    fetchCart,
    clearCartItems,
  };
};