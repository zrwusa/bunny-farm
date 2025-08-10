'use client';

import { useCart } from '@/hooks/shopping/cart/use-cart';
import { CartItem } from './cart-item';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import {X} from 'lucide-react';

export const Cart = () => {
    const { cart, loading, error } = useCart();
    const [coupon, setCoupon] = useState('');

    if (error) {
        return <div className="p-4 text-red-500">Error: {JSON.stringify(error)}</div>;
    }

    if (!loading && !cart?.items.length) {
        return (
            <div className="p-4 text-center" data-testid="empty-cart-message">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-600">Add some items to your cart to see them here.</p>
                <Button asChild className="mt-4">
                    <Link href="/shopping/products">Go shopping</Link>
                </Button>
            </div>
        );
    }

    const items = loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 space-y-2 border-b">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        ))
        : cart?.items.map((item) => <CartItem key={item.id} item={item} />);

    const totalPrice = cart?.items?.reduce((prev, item) => prev + (item.sku?.prices[0].price  ?? 0) * item.quantity, 0) ?? 0;
    const discountRate = 0.1;
    const discountedPrice = totalPrice * (1 - discountRate);

    return (
        <div className="bg-white rounded-md shadow-sm">
            {/* Items */}
            <div>{items}</div>


            <div className="mt-12">
                {/* Coupon */}
                <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Add coupon code"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
            -10%
          </span>
                    </div>
                    <button
                        onClick={() => console.log('apply coupon', coupon)}
                        className="p-1 text-gray-400 hover:text-gray-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Total */}
                <div className="px-4 py-3 border-t space-y-1">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Total:</span>
                        <span className="text-lg font-semibold">${discountedPrice.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Order and get {Math.floor(discountedPrice / 10)} points</span>
                        <span>Free shipping</span>
                    </div>
                </div>

                {/* Checkout */}
                <div className="px-4 pb-4">
                    <Button asChild className="w-full">
                        <Link href="/shopping/checkout">Proceed to Checkout</Link>
                    </Button>
                </div>
            </div>

        </div>
    );
};
