import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createPaymentIntent(amountOfCents: number, currency: string) {
    return await this.stripe.paymentIntents.create({
      amount: amountOfCents, // Unit is the smallest currency unit, for example 1000 means 10.00 USD
      currency,
    });
  }

  async retrievePaymentIntent(id: string) {
    return await this.stripe.paymentIntents.retrieve(id);
  }

  async createCheckoutSession() {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Test Item' },
            unit_amount: 3000, // $30.00
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
  }
}
