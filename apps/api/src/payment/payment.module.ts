import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  providers: [PaymentResolver, PaymentService, StripeResolver, StripeService],
  exports: [PaymentService],
})
export class PaymentModule {}
