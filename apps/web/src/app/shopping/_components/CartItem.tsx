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

  const price = item.variant?.prices[0]?.price || 0;
  const totalPrice = price * item.quantity;
  const imageUrl = item.variant?.product?.images[0]?.url;

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.variant?.product?.name || 'Product'}
            className="w-20 h-20 object-cover rounded"
          />
        )}
        <div>
          <h3 className="text-lg font-medium">
            {item.variant?.product?.name || 'Product'}
          </h3>
          <p className="text-sm text-gray-500">
            {item.variant?.color} - {item.variant?.size}
          </p>
          <p className="text-sm text-gray-500">SKU: {item.variant?.sku}</p>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <div className="text-right">
          <p className="text-lg font-medium">${price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total: ${totalPrice.toFixed(2)}</p>
        </div>
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