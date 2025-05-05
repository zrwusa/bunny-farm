// apps/api/src/cart/cart.sync.task.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CartSyncService } from './cart.sync.service';

@Injectable()
export class CartSyncTask {
  constructor(private readonly cartSyncService: CartSyncService) {}

  // Synchronize the user's shopping cart every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('Syncing active user carts...');
    await this.cartSyncService.syncActiveUsers();
  }
}
