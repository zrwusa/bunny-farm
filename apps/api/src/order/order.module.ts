import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../cart/cart.module';
// import { CookieModule } from '../core/cookie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product, OrderItem]),
    CartModule,
    PaymentModule,
    // CookieModule,
  ],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
