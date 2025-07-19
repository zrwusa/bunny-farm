// apps/web/src/components/features/shopping/payment/payment.tsx

'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { createPaymentIntent, getOrder } from '@/lib/api/client-actions';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Order } from '@/types/generated/graphql';
import {StripeTheme} from '@/types/stripe';

// Stripe element style configuration
const ELEMENTS_OPTIONS = {
    appearance: {
        theme: 'flat' as StripeTheme,
        variables: {
            colorPrimary: '#6366f1', // Tailwind indigo-500
            colorBackground: '#ffffff',
            colorText: '#111827', // Tailwind gray-900
            fontFamily: 'Inter, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        },
        rules: {
            '.Input': {
                padding: '12px 16px',
                border: '1px solid #e5e7eb', // Tailwind gray-200
            },
            '.Input:focus': {
                boxShadow: '0 0 0 2px #6366f1',
            },
            '.Tab, .Block': {
                backgroundColor: '#f9fafb',
            },
        },
    },
};

const PaymentForm = ({ amountOfCents }: { amountOfCents: number }) => {
    const [currency] = useState<string>('NZD');
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        (async () => {
            const clientSecret = await createPaymentIntent({ amountOfCents, currency });
            if (clientSecret) setClientSecret(clientSecret);
        })();
    }, [amountOfCents, currency]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <p>
                Total amount: <strong>${(amountOfCents / 100).toFixed(2)}</strong> ({currency})
            </p>
            <div className="rounded-md border px-4 py-2">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#111827',
                                fontFamily: 'Inter, sans-serif',
                                '::placeholder': {
                                    color: '#9ca3af',
                                },
                            },
                            invalid: {
                                color: '#ef4444',
                            },
                        },
                    }}
                />
            </div>
            <Button type="submit" disabled={!stripe || !clientSecret}>
                Pay
            </Button>
        </form>
    );
};

export default function Payment() {
    const params = useParams();
    const orderId = params.id;
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        if (typeof orderId === 'string') {
            getOrder(orderId).then((order) => setOrder(order));
        }
    }, [orderId]);

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Payment for order {orderId}</h1>
            {order && (
                <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
                    <div className="space-y-4">
                        <p>Status: <span className="font-semibold">{order.status}</span></p>
                        <PaymentForm amountOfCents={order.totalPrice * 100} />
                    </div>
                </Elements>
            )}
        </div>
    );
}

