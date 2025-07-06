import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { LoggerService } from '../core/logger.service';

@Controller('webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event;

    try {
      const payload = req.body;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      event = this.stripeService.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`Stripe event received: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        this.logger.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
        // TODO: Call another service to update the order
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
}
