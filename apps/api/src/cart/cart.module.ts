import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../user/entities/user.entity';
import { RedisModule } from '../redis/redis.module';
import { CartSyncService } from './cart.sync.service';
import { CartSyncTask } from './cart.sync.task';
import { Product } from '../product/entities/product.entity';
// import { CookieModule } from '../core/cookie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, User, Product]),
    RedisModule,
    // CookieModule
  ],
  providers: [CartResolver, CartService, CartSyncService, CartSyncTask],
  exports: [CartSyncService, CartService],
})
export class CartModule {}
