'use client';

import {FormEvent, useState} from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {createPaymentIntent} from '@/lib/api/client-actions';
import {Button} from '@/components/ui/button';
import {stripePromise} from '@/lib/stripe';


const CheckoutForm = () => {
    const [amountOfCents] = useState<number>(52);
    const [currency] = useState<string>('NZD');

    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');

    const handleCheckout = async () => {
        const clientSecret = await createPaymentIntent({ amountOfCents: amountOfCents, currency: currency});
        setClientSecret(clientSecret);
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
            <CardElement />
            <Button type="button" onClick={handleCheckout}>Create Payment</Button>
            <Button type="submit" disabled={!stripe}>Pay</Button>
        </form>
    );
};

export default function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
