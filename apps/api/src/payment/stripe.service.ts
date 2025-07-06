import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './stripe.provider';
import { LoggerService } from '../core/logger.service';

@Injectable()
export class StripeService {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly logger: LoggerService,
  ) {}

  constructEvent(payload: Buffer | string, signature: string, webhookSecret: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error('Stripe webhook validation failed', err);
      throw err;
    }
  }

  async createPaymentIntent(amount: number, currency: string) {
    this.logger.log(`Creating payment intent: ${amount} ${currency}`);
    return this.stripe.paymentIntents.create({ amount, currency });
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
