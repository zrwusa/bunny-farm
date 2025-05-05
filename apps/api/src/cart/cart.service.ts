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
    const entries = await this.redis.hgetall(key);

    const cart = new CachedCart();
    cart.id = key;
    cart.items = Object.entries(entries).map(([skuId, json]) => ({
      skuId,
      ...JSON.parse(json),
    })) as CartItem[];

    if (user?.id) {
      cart.user = await this.userRepo.findOne({
        where: { id: user.id },
      });
    }
    cart.deviceType = DeviceType.WEB;
    cart.clientCartId = clientCartId;
    cart.createdAt = new Date();
    cart.updatedAt = new Date();

    return cart;
  }

  async addOrUpdateItem(item: CartItemInput, user?: CurrentJwtUser, clientCartId?: string) {
    const key = this.getRedisKey(user?.id, clientCartId);
    const value = JSON.stringify(item);
    await this.redis.hset(key, item.skuId, value);

    if (clientCartId) {
      await this.redis.expire(key, 60 * 60 * 24 * 30);
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
    const newItem = existing ? { ...existing, quantity: existing.quantity + item.quantity } : item;

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
    await this.redis.del(key);
    return this.getCart({ user, clientCartId });
  }

  // TODO When a guest user login we need to call this method
  async mergeGuestCart(clientCartId: string, userId: string) {
    const guestKey = this.getRedisKey(undefined, clientCartId);
    const userKey = this.getRedisKey(userId);

    const guestItems = await this.redis.hgetall(guestKey);
    const userItems = await this.redis.hgetall(userKey);

    for (const [skuId, guestJson] of Object.entries(guestItems)) {
      const guestItem = JSON.parse(guestJson);
      if (userItems[skuId]) {
        const userItem = JSON.parse(userItems[skuId]);
        guestItem.quantity += userItem.quantity;
      }
      await this.redis.hset(userKey, skuId, JSON.stringify(guestItem));
    }

    await this.redis.del(guestKey);
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
