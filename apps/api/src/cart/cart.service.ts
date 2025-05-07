// apps/api/src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CartItemInput } from './dto/cart-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { DeviceType } from '../common/enums';
import { CachedCart } from './dto/cached-cart.object';
import { User } from '../user/entities/user.entity';
import { CurrentJwtUser } from '../auth/types/types';

@Injectable()
export class CartService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private getRedisKey(userId?: string, clientCartId?: string): string {
    if (userId) return `cart:user:${userId}`;
    if (clientCartId) return `cart:guest:${clientCartId}`;
    throw new Error('Either userId or clientCartId must be provided');
  }

  async getCart({
    user,
    clientCartId,
  }: {
    user?: CurrentJwtUser;
    clientCartId?: string;
  }): Promise<CachedCart> {
    const key = this.getRedisKey(user?.id, clientCartId);
    const metaKey = `${key}:meta`;

    const entries = await this.redis.hgetall(key);
    const metaJson = await this.redis.get(metaKey);
    const meta = metaJson ? JSON.parse(metaJson) : null;

    const cart = new CachedCart();
    cart.id = key;
    cart.items = Object.entries(entries).map(([skuId, json]) => {
      const parsed = JSON.parse(json);
      return {
        skuId,
        ...parsed,
        createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
        updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date(),
      };
    }) as CartItem[];

    if (user?.id) {
      cart.user = await this.userRepo.findOne({ where: { id: user.id } });
    }

    cart.deviceType = DeviceType.WEB;
    cart.clientCartId = clientCartId;
    cart.createdAt = meta?.createdAt ? new Date(meta.createdAt) : new Date();
    cart.updatedAt = meta?.updatedAt ? new Date(meta.updatedAt) : new Date();

    return cart;
  }

  async addOrUpdateItem(item: CartItemInput, user?: CurrentJwtUser, clientCartId?: string) {
    const now = new Date();
    const key = this.getRedisKey(user?.id, clientCartId);
    const metaKey = `${key}:meta`;

    const existing = await this.getItem(item.skuId, user?.id, clientCartId);
    const finalItem = {
      ...existing,
      ...item,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await this.redis.hset(key, item.skuId, JSON.stringify(finalItem));

    // Update cart metadata
    const metaJson = await this.redis.get(metaKey);
    const existingMeta = metaJson ? JSON.parse(metaJson) : {};
    const meta = {
      createdAt: existingMeta.createdAt ?? now.toISOString(),
      updatedAt: now.toISOString(),
    };
    await this.redis.set(metaKey, JSON.stringify(meta));

    if (clientCartId) {
      await this.redis.expire(key, 60 * 60 * 24 * 30);
      await this.redis.expire(metaKey, 60 * 60 * 24 * 30);
    }
  }

  async addItem({
    user,
    clientCartId,
    item,
  }: {
    user?: CurrentJwtUser;
    clientCartId?: string;
    item: CartItemInput;
  }) {
    const existing = await this.getItem(item.skuId, user?.id, clientCartId);
    const newItem = existing
      ? {
          ...existing,
          id: `${item.productId}:${item.skuId}`,
          quantity: existing.quantity + item.quantity,
          updatedAt: new Date(),
          createdAt: new Date(),
        }
      : {
          ...item,
          id: `${item.productId}:${item.skuId}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

    await this.addOrUpdateItem(newItem, user, clientCartId);
    return this.getCart({ user, clientCartId });
  }

  async updateQuantity({
    skuId,
    quantity,
    user,
    clientCartId,
  }: {
    skuId: string;
    quantity: number;
    user?: CurrentJwtUser;
    clientCartId?: string;
  }): Promise<any> {
    const existing = await this.getItem(skuId, user?.id, clientCartId);
    if (!existing) {
      throw new Error(`Item with skuId "${skuId}" not found in cart`);
    }

    const updatedItem = { ...existing, quantity };
    await this.addOrUpdateItem(updatedItem, user, clientCartId);
    return this.getCart({ user, clientCartId });
  }

  async removeItems({
    skuIds,
    user,
    clientCartId,
  }: {
    skuIds: string[];
    user?: CurrentJwtUser;
    clientCartId?: string;
  }) {
    const key = this.getRedisKey(user?.id, clientCartId);
    if (skuIds.length > 0) {
      await this.redis.hdel(key, ...skuIds);
    }
    return this.getCart({ user, clientCartId });
  }

  async setItemSelection({
    skuId,
    selected,
    user,
    clientCartId,
  }: {
    skuId: string;
    selected: boolean;
    user?: CurrentJwtUser;
    clientCartId?: string;
  }) {
    const key = this.getRedisKey(user?.id, clientCartId);
    const json = await this.redis.hget(key, skuId);
    if (!json) throw new NotFoundException(`Not exist json for key ${key}`);
    const item = JSON.parse(json);
    item.selected = selected;
    await this.redis.hset(key, skuId, JSON.stringify(item));
    return this.getCart({ user, clientCartId });
  }

  async clearCart({ user, clientCartId }: { user?: CurrentJwtUser; clientCartId?: string }) {
    const key = this.getRedisKey(user?.id, clientCartId);
    const metaKey = `${key}:meta`;
    await this.redis.del(key, metaKey);
    return this.getCart({ user, clientCartId });
  }

  // TODO When a guest user login we need to call this method
  async mergeGuestCart(clientCartId: string, userId: string) {
    const guestKey = this.getRedisKey(undefined, clientCartId);
    const userKey = this.getRedisKey(userId);

    const guestItems = await this.redis.hgetall(guestKey);
    const userItems = await this.redis.hgetall(userKey);

    // Merge shopping items
    for (const [skuId, guestJson] of Object.entries(guestItems)) {
      const guestItem = JSON.parse(guestJson);
      const userItemJson = userItems[skuId];

      if (userItemJson) {
        const userItem = JSON.parse(userItemJson);
        guestItem.quantity += userItem.quantity;

        // Keep the earlier createdAt
        guestItem.createdAt = new Date(
          Math.min(new Date(guestItem.createdAt).getTime(), new Date(userItem.createdAt).getTime()),
        ).toISOString();
      }

      guestItem.updatedAt = new Date().toISOString();
      await this.redis.hset(userKey, skuId, JSON.stringify(guestItem));
    }

    // Merge and update meta information
    const now = new Date();
    const guestMetaJson = await this.redis.get(`${guestKey}:meta`);
    const userMetaJson = await this.redis.get(`${userKey}:meta`);

    const guestMeta = guestMetaJson ? JSON.parse(guestMetaJson) : {};
    const userMeta = userMetaJson ? JSON.parse(userMetaJson) : {};

    const mergedMeta = {
      createdAt: guestMeta.createdAt
        ? new Date(
            Math.min(
              new Date(guestMeta.createdAt).getTime(),
              new Date(userMeta.createdAt ?? now).getTime(),
            ),
          ).toISOString()
        : (userMeta.createdAt ?? now.toISOString()),
      updatedAt: now.toISOString(),
    };

    await this.redis.set(`${userKey}:meta`, JSON.stringify(mergedMeta));

    // Delete guest cart and its meta
    await this.redis.del(guestKey, `${guestKey}:meta`);
  }

  async getItem(skuId: string, userId?: string, clientCartId?: string) {
    const key = this.getRedisKey(userId, clientCartId);
    const json = await this.redis.hget(key, skuId);
    return json ? JSON.parse(json) : null;
  }

  async syncRedisToDatabase(userId: string) {
    const redisKey = this.getRedisKey(userId);
    const redisCart = await this.redis.hgetall(redisKey);
    if (!redisCart || Object.keys(redisCart).length === 0) return;

    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'user'],
    });
    if (!cart) {
      const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
      cart = this.cartRepo.create({ user, deviceType: DeviceType.WEB, items: [] });
    }

    const items: CartItem[] = [];
    for (const [skuId, json] of Object.entries(redisCart)) {
      const { productId, quantity, selected } = JSON.parse(json);
      const item = this.cartItemRepo.create({ skuId, productId, quantity, selected });
      items.push(item);
    }

    cart.items = items;
    await this.cartRepo.save(cart);
    return true;
  }
}
