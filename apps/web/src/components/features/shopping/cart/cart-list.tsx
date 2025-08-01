// apps/web/src/components/features/shopping/cart/cart-list.tsx

'use client';

import {useCart} from '@/hooks/shopping/cart/useCart';
import {CartItem} from './cart-item';
import Link from 'next/link';
import {CartItem as CartItemType} from '@/types/generated/graphql';
import {Button} from '@/components/ui/button';
import {ButtonLink} from '@/components/ui/button-link';

export const Cart = () => {
    const {cart, loading, error, clearCartItems} = useCart();

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    if (!cart?.items.length) {
        return (
            <div className="p-4 text-center" data-testid="empty-cart-message">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-600">Add some items to your cart to see them here.</p>
                <ButtonLink href="/shopping/products">Go shopping</ButtonLink>
            </div>
        );
    }

    return (
        <div className="">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <Button
                    data-testid="clear-cart"
                    onClick={() => clearCartItems(cart.id)}
                >
                    Clear Cart
                </Button>
            </div>
            <div className="divide-y" data-testid="cart-items">
                {cart.items.map((item: CartItemType) => (
                    <CartItem key={item.id} item={item}/>
                ))}
            </div>
            <div className="p-4 border-t">
                <Link
                    href="/shopping/checkout"
                    className="block w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
                >
                    Proceed to Checkout
                </Link>
            </div>
        </div>
    );
};