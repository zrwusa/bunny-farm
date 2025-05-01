import { Injectable, OnModuleInit } from '@nestjs/common';
import { CartService } from './cart.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CartSyncService implements OnModuleInit {
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private syncTimer: NodeJS.Timeout;

  constructor(
    private cartService: CartService,
    private redisService: RedisService,
  ) {}

  onModuleInit() {
    this.startSync();
  }

  private startSync() {
    this.syncTimer = setInterval(async () => {
      await this.syncAllCarts();
    }, this.SYNC_INTERVAL);
  }

  private async syncAllCarts() {
    try {
      // Get all user cart keys
      const keys = await this.redisService.getKeys('cart:user:*');

      // Sync each cart
      for (const key of keys) {
        const userId = key.split(':')[2]; // Extract user ID from key
        await this.cartService.syncToDatabase(userId);
      }
    } catch (error) {
      console.error('Error syncing carts:', error);
    }
  }

  // Manually trigger synchronization
  async syncUserCart(userId: string) {
    await this.cartService.syncToDatabase(userId);
  }

  // Cleanup timer
  onModuleDestroy() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }
}
