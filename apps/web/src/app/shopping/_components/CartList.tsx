'use client';

import { useCart } from '../_hooks/useCart';
import { CartItem } from './CartItem';
import { CartItem as CartItemType } from '../_types/cart';

export const CartList = () => {
  const { cartSession, loading, error, clearCartItems } = useCart();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!cartSession || cartSession.items.length === 0) {
    return <div className="p-4">Your cart is empty</div>;
  }

  const totalPrice = cartSession.items.reduce((sum: number, item: CartItemType) => {
    const price = item.variant?.prices[0]?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <button
          onClick={clearCartItems}
          className="text-red-500 hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>
      <div className="divide-y">
        {cartSession.items.map((item: CartItemType) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};