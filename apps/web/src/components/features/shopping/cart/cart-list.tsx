// apps/web/src/components/features/shopping/cart/cart-list.tsx
'use client';

import { useCart } from '@/hooks/shopping/cart/use-cart';
import { CartItem } from './cart-item';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/generated/graphql';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Skeleton } from '@/components/ui/skeleton';

export const Cart = () => {
    const { cart, loading, error, clearCartItems } = useCart();

    if (error) {
        return <div className="p-4 text-red-500">Error: {JSON.stringify(error)}</div>;
    }

    if (!loading && !cart?.items.length) {
        return (
            <div className="p-4 text-center" data-testid="empty-cart-message">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-600">Add some items to your cart to see them here.</p>
                <ButtonLink href="/shopping/products">Go shopping</ButtonLink>
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
        : cart?.items.map((item: CartItemType) => (
            <CartItem key={item.id} item={item} />
        ));

    return (
        <div className="">
            <div className="flex justify-between items-center p-4 border-b">
                {loading ? (
                    <>
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-10 w-24" />
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold">Shopping Cart</h2>
                        <Button
                            data-testid="clear-cart"
                            onClick={() => clearCartItems(cart!.id)}
                        >
                            Clear Cart
                        </Button>
                    </>
                )}
            </div>
            <div className="divide-y" data-testid="cart-items">
                {items}
            </div>
            <div className="p-4 border-t">
                {loading ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <Link
                        href="/shopping/checkout"
                        className="block w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
                    >
                        Proceed to Checkout
                    </Link>
                )}
            </div>
        </div>
    );
};
