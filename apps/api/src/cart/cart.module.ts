import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartSession } from './entities/cart-session.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartSession, CartItem, User])],
  providers: [CartResolver, CartService],
})
export class CartModule {}
