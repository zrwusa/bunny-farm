'use client';

import {useEffect, useState} from 'react';
import {CartItemInput, PaymentMethod} from '@/types/generated/graphql';
import {getSelectedCartItems, placeOrder} from '@/lib/api/client-actions';
import {Button} from '@/components/ui/button';

export default function CheckoutPage() {
    const [items, setItems] = useState<CartItemInput[]>([])

    useEffect(() => {
        // TODO: Fetch order details
        // This is where we'll add the order fetching logic

        getSelectedCartItems().then((items) => {
            console.log('---items', items)
            setItems(items as CartItemInput[])
        });

    }, []);


    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-3xl font-bold">Checkout Details</h1>
            {/* TODO: Add order details content */}
            <ul>
                {
                    items.map(({skuId, productId, quantity, selected}) => <li key={skuId}>
                        <span>skuId: {skuId}</span>
                        <span>productId: {productId}</span>
                        <span>quantity: {quantity}</span>
                        <span>selected: {selected}</span>
                    </li>)
                }
            </ul>
            <Button onClick={async ()=> {
                await placeOrder({items, addressId: '1', paymentMethod: PaymentMethod.CreditCard})
            }}>Place Order</Button>
        </div>
    );
}