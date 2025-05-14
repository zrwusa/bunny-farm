// apps/api/src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CartItemInput } from './dto/cart-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { DeviceType } from '../common/enums';
import { CachedCart } from './dto/cached-cart.object';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { EnrichedCartItem } from './dto/enriched-cart-item.object';
import { SKU } from '../product/entities/sku.entity';
import { SelectedCartItemOutput } from './dto/selected-cart-item.output';

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
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  private getRedisKey(userId?: string, clientCartId?: string): string {
    if (userId) return `cart:user:${userId}`;
    if (clientCartId) return `cart:guest:${clientCartId}`;
    throw new Error('Either userId or clientCartId must be provided');
  }

  async getCart(userId?: string, clientCartId?: string): Promise<CachedCart> {
    const key = this.getRedisKey(userId, clientCartId);
    const metaKey = `${key}:meta`;

    const entries = await this.redis.hgetall(key);
    const metaJson = await this.redis.get(metaKey);
    const meta = metaJson ? JSON.parse(metaJson) : null;

    const itemsRaw = Object.entries(entries).map(([skuId, json]) => {
      const parsed = JSON.parse(json);
      return {
        skuId,
        ...parsed,
        createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
        updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date(),
      };
    });

    const productIds = Array.from(new Set(itemsRaw.map((i) => i.productId).filter(Boolean)));
    const skuIds = Array.from(new Set(itemsRaw.map((i) => i.skuId).filter(Boolean)));
    const [products, skus] = await Promise.all([
      this.productRepo.find({ where: { id: In(productIds) } }),
      this.productRepo.manager.getRepository(SKU).find({ where: { id: In(skuIds) } }),
    ]);

    const productMap = new Map(products.map((p) => [p.id, p]));
    const skuMap = new Map(skus.map((s) => [s.id, s]));

    const items: EnrichedCartItem[] = itemsRaw.map((item) => {
      const enriched = new EnrichedCartItem();
      Object.assign(enriched, item);
      enriched.product = productMap.get(item.productId);
      enriched.sku = skuMap.get(item.skuId);
      return enriched;
    });

    const cart = new CachedCart();
    cart.id = key;
    cart.items = items;
    cart.deviceType = DeviceType.WEB;
    cart.clientCartId = clientCartId;
    cart.createdAt = meta?.createdAt ? new Date(meta.createdAt) : new Date();
    cart.updatedAt = meta?.updatedAt ? new Date(meta.updatedAt) : new Date();

    if (userId) {
      cart.user = await this.userRepo.findOne({ where: { id: userId } });
    }

    return cart;
  }

  async addOrUpdateItem(item: CartItemInput, userId?: string, clientCartId?: string) {
    const now = new Date();
    const key = this.getRedisKey(userId, clientCartId);
    const metaKey = `${key}:meta`;

    const existing = await this.getItem(item.skuId, userId, clientCartId);
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

  async addItem(item: CartItemInput, userId?: string, clientCartId?: string) {
    const existing = await this.getItem(item.skuId, userId, clientCartId);
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

    await this.addOrUpdateItem(newItem, userId, clientCartId);
    return this.getCart(userId, clientCartId);
  }

  async updateQuantity(
    skuId: string,
    quantity: number,
    userId?: string,
    clientCartId?: string,
  ): Promise<any> {
    const existing = await this.getItem(skuId, userId, clientCartId);
    if (!existing) {
      throw new Error(`Item with skuId "${skuId}" not found in cart`);
    }

    const updatedItem = { ...existing, quantity };
    await this.addOrUpdateItem(updatedItem, userId, clientCartId);
    return this.getCart(userId, clientCartId);
  }

  async removeItems(skuIds: string[], userId?: string, clientCartId?: string) {
    const key = this.getRedisKey(userId, clientCartId);
    if (skuIds.length > 0) {
      await this.redis.hdel(key, ...skuIds);
    }
    return this.getCart(userId, clientCartId);
  }

  async setItemSelection(skuId: string, selected: boolean, userId?: string, clientCartId?: string) {
    const key = this.getRedisKey(userId, clientCartId);
    const json = await this.redis.hget(key, skuId);
    if (!json) throw new NotFoundException(`Not exist json for key ${key}`);
    const item = JSON.parse(json);
    item.selected = selected;
    await this.redis.hset(key, skuId, JSON.stringify(item));
    return this.getCart(userId, clientCartId);
  }

  async clearCart(userId?: string, clientCartId?: string) {
    const key = this.getRedisKey(userId, clientCartId);
    const metaKey = `${key}:meta`;
    await this.redis.del(key, metaKey);
    return this.getCart(userId, clientCartId);
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

  // Before placing an order, the front-end can be used to automatically build PlaceOrderInput.
  async getSelectedItems(
    userId?: string,
    clientCartId?: string,
  ): Promise<SelectedCartItemOutput[]> {
    const cart = await this.getCart(userId, clientCartId);
    return cart.items
      .filter((item) => item.selected)
      .map((item) => ({
        skuId: item.skuId,
        productId: item.productId,
        quantity: item.quantity,
        selected: true,
      }));
  }
}
