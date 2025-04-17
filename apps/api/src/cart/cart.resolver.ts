import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartSession } from './entities/cart-session.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => CartSession)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => CartSession)
  @UseGuards(GqlAuthGuard)
  async createCart(
    @Args('createCartInput') createCartInput: CreateCartInput,
    @CurrentUser('userId') userId: string,
  ) {
    // 确保用户只能创建自己的购物车
    createCartInput.userId = userId;
    return this.cartService.create(createCartInput);
  }

  @Query(() => CartSession, { name: 'myCart' })
  @UseGuards(GqlAuthGuard)
  async getMyCart(@CurrentUser('userId') userId: string) {
    let cart = await this.cartService.findByUserId(userId);
    if (!cart) {
      // 如果用户没有购物车，创建一个新的
      cart = await this.cartService.create({ userId, items: [] });
    }
    return cart;
  }

  @Query(() => CartSession, { name: 'cart' })
  @UseGuards(GqlAuthGuard)
  async getCart(@Args('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Mutation(() => CartSession)
  @UseGuards(GqlAuthGuard)
  async updateCart(
    @Args('updateCartInput') updateCartInput: UpdateCartInput,
    @CurrentUser('userId') userId: string,
  ) {
    // 验证购物车所有权
    const cart = await this.cartService.findOne(updateCartInput.id);
    if (cart.user.id !== userId) {
      throw new Error('Unauthorized to update this cart');
    }
    return this.cartService.update(updateCartInput.id, updateCartInput);
  }

  @Mutation(() => CartSession)
  @UseGuards(GqlAuthGuard)
  async removeCart(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    // 验证购物车所有权
    const cart = await this.cartService.findOne(id);
    if (cart.user.id !== userId) {
      throw new Error('Unauthorized to remove this cart');
    }
    return this.cartService.remove(id);
  }

  @Mutation(() => CartSession)
  @UseGuards(GqlAuthGuard)
  async clearCart(
    @Args('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    // 验证购物车所有权
    const cart = await this.cartService.findOne(id);
    if (cart.user.id !== userId) {
      throw new Error('Unauthorized to clear this cart');
    }
    return this.cartService.clearCart(id);
  }
}
