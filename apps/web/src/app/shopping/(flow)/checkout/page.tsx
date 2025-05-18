'use client';

import {useEffect, useState} from 'react';
import {EnrichedCartItem, PaymentMethod} from '@/types/generated/graphql';
import {getSelectedCartItems, placeOrder} from '@/lib/api/client-actions';
import {Button} from '@/components/ui/button';
import Checkout from '@/components/features/payment';
import Image from 'next/image';

export default function CheckoutPage() {
    const [items, setItems] = useState<EnrichedCartItem[]>([])

    useEffect(() => {
        // TODO: Fetch order details
        // This is where we'll add the order fetching logic

        getSelectedCartItems().then((items) => {
            console.log('---items', items)
            setItems(items)
        });

    }, []);


    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-3xl font-bold">Checkout Details</h1>
            {/* TODO: Add order details content */}
            <ul>
                {
                    items.map(({skuId, quantity, product}) => <li key={skuId}>
                        <span> {product?.name}</span>
                        <span><Image src={product?.images[0]?.url || '/avatar.svg'} width={200} height={200} alt={skuId}/></span>
                        <span> X {quantity}</span>
                    </li>)
                }
            </ul>
            <Button onClick={async ()=> {
                await placeOrder({items, addressId: '1', paymentMethod: PaymentMethod.CreditCard})
            }}>Place Order</Button>
            <Checkout />
        </div>
    );
}