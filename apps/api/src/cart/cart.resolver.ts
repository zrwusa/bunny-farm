// apps/api/src/cart/cart.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateItemQuantityInput } from './dto/update-item-quantity.input';
import { AddItemToCartInput } from './dto/add-item-to-cart.input';
import { RemoveItemsInput } from './dto/remove-items.input';
import { CachedCart } from './dto/cached-cart.object';
import { UseGuards } from '@nestjs/common';
import { OptionalGqlAuthGuard } from '../auth/guards/optional-gql-auth.guard';
import { CurrentJwtUser } from '../auth/types/types';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CachedCart, { name: 'cart' })
  @UseGuards(OptionalGqlAuthGuard)
  async getCart(
    @Args('clientCartId', { nullable: true }) clientCartId?: string,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    return this.cartService.getCart({ user, clientCartId });
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async addToCart(
    @Args('addItemToCartInput') addItemToCartInput: AddItemToCartInput,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    const { clientCartId, item } = addItemToCartInput;
    return this.cartService.addItem({ user, clientCartId, item });
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async updateItemQuantity(
    @Args('updateItemQuantityInput') updateItemQuantityInput: UpdateItemQuantityInput,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    const { clientCartId, skuId, quantity } = updateItemQuantityInput;
    return this.cartService.updateQuantity({ user, clientCartId, skuId, quantity });
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async removeItems(
    @Args('removeItemsInput') removeItemsInput: RemoveItemsInput,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    const { clientCartId, skuIds } = removeItemsInput;
    return this.cartService.removeItems({ user, clientCartId, skuIds });
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async toggleItemSelection(
    @Args('skuId') skuId: string,
    @Args('selected') selected: boolean,
    @Args('clientCartId', { nullable: true }) clientCartId?: string,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    return this.cartService.setItemSelection({ user, clientCartId, skuId, selected });
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async clearCart(
    @Args('clientCartId', { nullable: true }) clientCartId?: string,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    return this.cartService.clearCart({ user, clientCartId });
  }
}
