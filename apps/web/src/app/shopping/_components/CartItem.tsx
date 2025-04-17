'use client';

import { useCart } from '../_hooks/useCart';
import { CartItem as CartItemType } from '../_types/cart';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    updateCartItemQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="text-lg font-medium">
            Product ID: {item.productId}
          </h3>
          <p className="text-sm text-gray-500">
            SKU: {item.skuId}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4">
          <select
            value={item.quantity}
            onChange={handleQuantityChange}
            className="border rounded p-1"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};