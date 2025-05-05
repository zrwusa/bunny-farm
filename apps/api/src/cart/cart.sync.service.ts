// apps/api/src/cart/cart.sync.service.ts
import { Injectable } from '@nestjs/common';
import { CartService } from './cart.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartSyncService {
  constructor(
    private readonly cartService: CartService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Single user synchronization
  async syncUserCart(userId: string) {
    try {
      return this.cartService.syncRedisToDatabase(userId);
    } catch (error) {
      console.error(`Error syncing cart for user ${userId}:`, error);
    }
  }

  // Cycle user shopping cart data in batches
  async syncActiveUsers(): Promise<Map<string, boolean>> {
    const activeUsers = await this.userRepo.find();
    const userIds = activeUsers.map((user) => user.id);
    const status = new Map<string, boolean>();
    for (const userId of userIds) {
      const isSuccess = await this.syncUserCart(userId);
      status.set(userId, isSuccess ?? false);
    }
    return status;
  }
}
