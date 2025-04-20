'use client';

import { useCart } from '../_hooks/useCart';
import { CartItem } from './cart-item';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/generated/graphql';
export const CartList = () => {
  const { cartSession, loading, error, clearCartItems } = useCart();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!cartSession?.items.length) {
    return (
      <div className="p-4 text-center" data-testid="empty-cart-message">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600">Add some items to your cart to see them here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <button
          data-testid="clear-cart"
          onClick={() => clearCartItems(cartSession.id)}
          className="text-red-500 hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>
      <div className="divide-y" data-testid="cart-items">
        {cartSession.items.map((item: CartItemType) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="p-4 border-t">
        <Link
          href="/shopping/order"
          className="block w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};