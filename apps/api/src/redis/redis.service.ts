import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  // Get cart from Redis
  async getCart(key: string): Promise<any> {
    const data = await this.redis.get(key);
    if (!data) return null;

    const cart = JSON.parse(data);
    // Convert date strings back to Date objects
    if (cart.createdAt) cart.createdAt = new Date(cart.createdAt);
    if (cart.updatedAt) cart.updatedAt = new Date(cart.updatedAt);
    if (cart.items) {
      cart.items = cart.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    }
    return cart;
  }

  // Set cart to Redis
  async setCart(key: string, data: any, ttl?: number): Promise<void> {
    // Convert Date objects to ISO strings for storage
    const cart = {
      ...data,
      createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Date ? data.updatedAt.toISOString() : data.updatedAt,
      items: data.items?.map((item: any) => ({
        ...item,
        createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
      })),
    };

    const serializedData = JSON.stringify(cart);
    if (ttl) {
      await this.redis.setex(key, ttl, serializedData);
    } else {
      await this.redis.set(key, serializedData);
    }
  }

  // Delete cart from Redis
  async deleteCart(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Merge carts in Redis
  async mergeCarts(sourceKey: string, targetKey: string): Promise<void> {
    const sourceCart = await this.getCart(sourceKey);
    const targetCart = await this.getCart(targetKey);

    if (!sourceCart) return;

    if (!targetCart) {
      // Ensure dates are Date objects
      const normalizedCart = {
        ...sourceCart,
        createdAt: new Date(sourceCart.createdAt),
        updatedAt: new Date(sourceCart.updatedAt),
        items: sourceCart.items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })),
      };
      await this.setCart(targetKey, normalizedCart);
    } else {
      // Merge logic: accumulate quantities for same items
      const mergedItems = [...targetCart.items];
      sourceCart.items.forEach((sourceItem: any) => {
        const existingItem = mergedItems.find(
          (item) => item.productId === sourceItem.productId && item.skuId === sourceItem.skuId
        );
        if (existingItem) {
          existingItem.quantity += sourceItem.quantity;
        } else {
          mergedItems.push({
            ...sourceItem,
            createdAt: new Date(sourceItem.createdAt),
            updatedAt: new Date(sourceItem.updatedAt),
          });
        }
      });

      const normalizedCart = {
        ...targetCart,
        createdAt: new Date(targetCart.createdAt),
        updatedAt: new Date(),
        items: mergedItems,
      };
      await this.setCart(targetKey, normalizedCart);
    }

    // Delete source cart
    await this.deleteCart(sourceKey);
  }

  // Get keys by pattern
  async getKeys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }
}