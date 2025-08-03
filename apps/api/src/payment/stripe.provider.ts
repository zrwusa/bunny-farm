import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import Stripe from 'stripe';

export const STRIPE_CLIENT = 'STRIPE_CLIENT';

export const StripeClientProvider: Provider = {
  provide: STRIPE_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Stripe(configService.get<string>('STRIPE_SECRET_KEY')!, {
      apiVersion: configService.get<'2025-07-30.basil'>('STRIPE_API_VERSION') || '2025-07-30.basil',
    });
  },
};
