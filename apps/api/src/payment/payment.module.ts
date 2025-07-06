import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { StripeResolver } from './stripe.resolver';
import { StripeModule } from './stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order]), StripeModule],
  providers: [PaymentResolver, PaymentService, StripeResolver],
  exports: [PaymentService],
})
export class PaymentModule {}
