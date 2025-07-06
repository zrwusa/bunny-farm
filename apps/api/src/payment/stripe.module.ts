import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../core/logger.module';
import { StripeClientProvider } from './stripe.provider';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [StripeClientProvider, StripeService],
  exports: [StripeService],
})
export class StripeModule {}
