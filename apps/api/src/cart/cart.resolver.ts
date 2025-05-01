import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartSession } from './entities/cart-session.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RedisService } from '../redis/redis.service';
import { OptionalGqlAuthGuard } from '../auth/guards/optional-gql-auth.guard';

@Resolver(() => CartSession)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly redisService: RedisService,
  ) {}

  @Mutation(() => CartSession)
  @UseGuards(OptionalGqlAuthGuard)
  async createCart(
    @Args('createCartInput') createCartInput: CreateCartInput,
    @CurrentUser('userId') userId?: string,
    @Args('sessionId', { nullable: true }) sessionId?: string,
  ) {
    if (userId) {
      createCartInput.userId = userId;
    }
    return this.cartService.create(createCartInput, sessionId);
  }

  @Query(() => CartSession, { name: 'cart' })
  @UseGuards(GqlAuthGuard)
  async getCart(@Args('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Mutation(() => CartSession)
  async updateCart(
    @Args('updateCartInput') updateCartInput: UpdateCartInput,
    @CurrentUser('userId') userId?: string,
  ) {
    const cart = await this.cartService.findOne(updateCartInput.id);

    // If it's a user cart, verify ownership
    if (cart.user) {
      if (!userId || cart.user.id !== userId) {
        throw new Error('Unauthorized to update this cart');
      }
    }

    return this.cartService.update(updateCartInput.id, updateCartInput);
  }

  @Query(() => CartSession, { name: 'myCart' })
  @UseGuards(OptionalGqlAuthGuard)
  async getMyCart(
    @CurrentUser('userId') userId?: string,
    @Args('sessionId', { nullable: true }) sessionId?: string,
  ) {
    console.log('---userId', userId);
    if (userId) {
      let cart = await this.cartService.findByUserId(userId);
      if (!cart) {
        cart = await this.cartService.create({ userId, items: [] }, sessionId);
      }
      return cart;
    } else if (sessionId) {
      return this.cartService.getGuestCart(sessionId);
    }
    return null;
  }

  @Mutation(() => CartSession)
  @UseGuards(GqlAuthGuard)
  async removeCart(@Args('id') id: string, @CurrentUser('userId') userId: string) {
    // Verify cart ownership
    const cart = await this.cartService.findOne(id);
    if (!cart.user || cart.user.id !== userId) {
      throw new Error('Unauthorized to remove this cart');
    }
    return this.cartService.remove(id);
  }

  @Mutation(() => CartSession)
  async clearCart(@Args('id') id: string, @CurrentUser('userId') userId?: string) {
    // Check if it's a guest cart
    const guestCartKey = this.cartService.getGuestCartKey(id);
    const guestCart = await this.redisService.getCart(guestCartKey);

    if (guestCart) {
      // Clear guest cart
      await this.redisService.deleteCart(guestCartKey);
      return {
        id,
        items: [],
        user: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // If it's a user cart, verify ownership
    const cart = await this.cartService.findOne(id);
    if (!cart.user || !userId || cart.user.id !== userId) {
      throw new Error('Unauthorized to clear this cart');
    }

    return this.cartService.clearCart(id);
  }
}
