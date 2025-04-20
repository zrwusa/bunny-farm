import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { CartSession } from './entities/cart-session.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../user/entities/user.entity';
import { RedisService } from '../redis/redis.service';

interface CartItemData {
  productId: string;
  skuId: string;
  quantity: number;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartSession)
    private readonly cartSessionRepository: Repository<CartSession>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  private getUserCartKey(userId: string): string {
    return `user:${userId}:cart`;
  }

  public getGuestCartKey(sessionId: string): string {
    return `guest:${sessionId}:cart`;
  }

  async getGuestCart(sessionId: string) {
    const guestCartKey = this.getGuestCartKey(sessionId);
    let cart = await this.redisService.getCart(guestCartKey);

    if (!cart) {
      // Create a new guest cart if it doesn't exist
      cart = {
        id: sessionId,
        items: [],
        user: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.redisService.setCart(guestCartKey, cart);
    }

    return cart;
  }

  async getCart(userId: string, sessionId?: string) {
    // Prioritize fetching from Redis
    const userCartKey = this.getUserCartKey(userId);
    let cart = await this.redisService.getCart(userCartKey);

    if (!cart) {
      // If not in Redis, load from database
      cart = await this.findOne(userId);
      if (cart) {
        // Cache to Redis
        await this.redisService.setCart(userCartKey, cart);
      }
    }

    // If logged in user has sessionId, try to merge anonymous cart
    if (sessionId) {
      const guestCartKey = this.getGuestCartKey(sessionId);
      const guestCart = await this.redisService.getCart(guestCartKey);

      if (guestCart) {
        await this.redisService.mergeCarts(guestCartKey, userCartKey);
        cart = await this.redisService.getCart(userCartKey);
      }
    }

    return cart;
  }

  async create(createCartInput: CreateCartInput, sessionId?: string) {
    const { userId, items } = createCartInput;

    if (userId) {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Create cart session
      const cartSession = this.cartSessionRepository.create({ user });
      await this.cartSessionRepository.save(cartSession);

      // Add cart items
      if (items && items.length > 0) {
        const cartItems = items.map((item: CartItemData) =>
          this.cartItemRepository.create({
            session: cartSession,
            productId: item.productId,
            skuId: item.skuId,
            quantity: item.quantity,
          })
        );
        await this.cartItemRepository.save(cartItems);
      }

      const cart = await this.findOne(cartSession.id);

      // Cache to Redis
      const userCartKey = this.getUserCartKey(userId);
      await this.redisService.setCart(userCartKey, cart);

      // If logged in user has sessionId, try to merge anonymous cart
      if (sessionId) {
        const guestCartKey = this.getGuestCartKey(sessionId);
        const guestCart = await this.redisService.getCart(guestCartKey);

        if (guestCart) {
          await this.redisService.mergeCarts(guestCartKey, userCartKey);
          return await this.redisService.getCart(userCartKey);
        }
      }

      return cart;
    } else if (sessionId) {
      // Create guest cart
      const guestCartKey = this.getGuestCartKey(sessionId);
      const cart = {
        id: sessionId,
        items: (items || []).map(item => ({
          id: `${sessionId}-${item.productId}-${item.skuId}-${Date.now()}`,
          productId: item.productId,
          skuId: item.skuId,
          quantity: item.quantity,
          selected: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        user: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.redisService.setCart(guestCartKey, cart);
      return cart;
    }

    throw new BadRequestException('Either userId or sessionId must be provided');
  }

  async findAll() {
    return this.cartSessionRepository.find({
      relations: ['items', 'user'],
    });
  }

  async findOne(id: string) {
    // First check if it's a guest cart
    const guestCartKey = this.getGuestCartKey(id);
    const guestCart = await this.redisService.getCart(guestCartKey);

    if (guestCart) {
      return guestCart;
    }

    // If not a guest cart, try to find in database
    try {
      const cart = await this.cartSessionRepository.findOne({
        where: { id },
        relations: ['items', 'user'],
      });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      return cart;
    } catch (error) {
      // If database query fails (e.g., because ID is not bigint), return null
      return null;
    }
  }

  async findByUserId(userId: string) {
    return this.cartSessionRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'user'],
    });
  }

  async update(id: string, updateCartInput: UpdateCartInput) {
    const cart = await this.findOne(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (updateCartInput.items) {
      // If it's a guest cart, update Redis directly
      if (!cart.user) {
        const guestCartKey = this.getGuestCartKey(id);
        const updatedCart = {
          ...cart,
          items: updateCartInput.items.map(item => ({
            id: `${id}-${item.productId}-${item.skuId}-${Date.now()}`,
            productId: item.productId,
            skuId: item.skuId,
            quantity: item.quantity,
            selected: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          updatedAt: new Date(),
        };
        await this.redisService.setCart(guestCartKey, updatedCart);
        return updatedCart;
      }

      // If it's a user cart, update database
      await this.cartItemRepository.delete({ session: { id } });
      const cartItems = updateCartInput.items.map((item: CartItemData) =>
        this.cartItemRepository.create({
          session: cart,
          productId: item.productId,
          skuId: item.skuId,
          quantity: item.quantity,
        })
      );
      await this.cartItemRepository.save(cartItems);
    }

    const updatedCart = await this.findOne(id);

    // Update Redis cache
    const cartKey = this.getUserCartKey(cart.user.id);
    await this.redisService.setCart(cartKey, updatedCart);

    return updatedCart;
  }

  async remove(id: string) {
    const cart = await this.findOne(id);
    await this.cartSessionRepository.remove(cart);
    return cart;
  }

  async clearCart(id: string) {
    // Check if this is a guest cart (Redis cart)
    const guestCartKey = this.getGuestCartKey(id);
    const guestCart = await this.redisService.getCart(guestCartKey);

    if (guestCart) {
      // Clear guest cart in Redis
      await this.redisService.deleteCart(guestCartKey);
      return;
    }

    // If not a guest cart, try to find user cart by user ID
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete Redis cache
    const userCartKey = this.getUserCartKey(user.id);
    await this.redisService.deleteCart(userCartKey);

    // Asynchronously delete cart records from database
    this.asyncDeleteCartFromDatabase(user.id);
  }

  // Asynchronously delete cart records from database
  private async asyncDeleteCartFromDatabase(userId: string) {
    try {
      // Find all user's carts
      const userCarts = await this.cartSessionRepository.find({
        where: { user: { id: userId } },
        relations: ['items'],
      });

      // Delete all cart items
      for (const cart of userCarts) {
        await this.cartItemRepository.delete({ session: { id: cart.id } });
      }

      // Delete all cart sessions
      await this.cartSessionRepository.delete({ user: { id: userId } });
    } catch (error) {
      console.error('Error deleting cart from database:', error);
    }
  }

  // Asynchronously sync to database
  async syncToDatabase(userId: string) {
    const userCartKey = this.getUserCartKey(userId);
    const cart = await this.redisService.getCart(userCartKey);

    if (cart) {
      const existingCart = await this.cartSessionRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items'],
      });

      if (existingCart) {
        // Update existing cart
        await this.cartItemRepository.delete({ session: { id: existingCart.id } });
        const cartItems = cart.items.map((item: CartItemData) =>
          this.cartItemRepository.create({
            session: existingCart,
            productId: item.productId,
            skuId: item.skuId,
            quantity: item.quantity,
          })
        );
        await this.cartItemRepository.save(cartItems);
      } else {
        // Create new cart
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
          const newCart = this.cartSessionRepository.create({ user });
          await this.cartSessionRepository.save(newCart);

          const cartItems = cart.items.map((item: CartItemData) =>
            this.cartItemRepository.create({
              session: newCart,
              productId: item.productId,
              skuId: item.skuId,
              quantity: item.quantity,
            })
          );
          await this.cartItemRepository.save(cartItems);
        }
      }
    }
  }
}
