import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartSession } from './entities/cart-session.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../user/entities/user.entity';
import { RedisModule } from '../redis/redis.module';
import { CartSyncService } from './cart.sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartSession, CartItem, User]),
    RedisModule,
  ],
  providers: [CartResolver, CartService, CartSyncService],
})
export class CartModule {}
