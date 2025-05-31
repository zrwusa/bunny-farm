'use client';

import {FormEvent, useEffect, useState} from 'react';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {createPaymentIntent, getOrder} from '@/lib/api/client-actions';
import {Button} from '@/components/ui/button';
import {stripePromise} from '@/lib/stripe';
import {useParams} from 'next/navigation';
import {Order} from '@/types/generated/graphql';


const PaymentForm = ({amountOfCents}: { amountOfCents: number }) => {
    const [currency] = useState<string>('NZD');

    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');

    const handleCheckout = async () => {
        const clientSecret = await createPaymentIntent({amountOfCents: amountOfCents, currency: currency});
        if (clientSecret) setClientSecret(clientSecret);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log('---clientSecret', clientSecret)
        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
            },
        });

        if (result.error) {
            console.error(result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
            alert('Payment succeeded!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <p>Total amount: <span>{amountOfCents / 100}</span>
                Currency: <span>{currency}</span></p>
            <CardElement/>
            <Button type="button" onClick={handleCheckout}>Create Payment</Button>
            <Button type="submit" disabled={!stripe}>Pay</Button>
        </form>
    );
};

export default function Payment() {
    const params = useParams();
    const orderId = params.id;

    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        if (typeof orderId === 'string')
            getOrder(orderId).then((order) => setOrder(order));
    }, [orderId]);

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold">Payment for order {orderId}</h1>
            {
                order
                    ? <div><p>
                        {order.status}
                    </p>
                        <p>

                        </p>
                        <Elements stripe={stripePromise}>
                            <PaymentForm amountOfCents={order.totalPrice * 100}/>
                        </Elements>
                    </div>
                    : null
            }
        </div>


    );
}
