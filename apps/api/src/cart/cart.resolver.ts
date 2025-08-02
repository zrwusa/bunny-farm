// apps/api/src/cart/cart.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ToggleItemSelectionInput,
  UpdateItemQuantityInput,
} from './dto/update-item-quantity.input';
import { AddItemToCartInput } from './dto/add-item-to-cart.input';
import { CachedCart } from './dto/cached-cart.object';
import { UseGuards } from '@nestjs/common';
import { OptionalGqlAuthGuard } from '../auth/guards/optional-gql-auth.guard';
import { CurrentJwtUser } from '../auth/types/types';
import { EnrichedCartItem } from './dto/enriched-cart-item.object';
import { RemoveItemsInput } from './dto/remove-items.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CachedCart, { name: 'cart' })
  @UseGuards(OptionalGqlAuthGuard)
  async getCart(
    @Args('guestCartId', { nullable: true }) guestCartId?: string,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    return this.cartService.getCart(user?.id, guestCartId);
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async addToCart(
    @Args('addItemToCartInput') addItemToCartInput: AddItemToCartInput,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    const { guestCartId, item } = addItemToCartInput;
    return this.cartService.addItem(item, user?.id, guestCartId);
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async updateItemQuantity(
    @Args('updateItemQuantityInput') updateItemQuantityInput: UpdateItemQuantityInput,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    const { guestCartId, skuId, quantity } = updateItemQuantityInput;
    return this.cartService.updateQuantity(skuId, quantity, user?.id, guestCartId);
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async toggleItemSelection(
    @Args('toggleItemSelection') toggleItemSelectionInput: ToggleItemSelectionInput,
    @Args('guestCartId', { nullable: true }) guestCartId?: string,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    const { skuId, selected } = toggleItemSelectionInput;
    return this.cartService.setItemSelection(skuId, selected, user?.id, guestCartId);
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async removeItems(
    @Args('removeItemsInput') removeItemsInput: RemoveItemsInput,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    const { guestCartId, skuIds } = removeItemsInput;
    return this.cartService.removeItems(skuIds, user?.id, guestCartId);
  }

  @Mutation(() => CachedCart)
  @UseGuards(OptionalGqlAuthGuard)
  async clearCart(
    @Args('guestCartId', { nullable: true }) guestCartId?: string,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<CachedCart> {
    return this.cartService.clearCart(user?.id, guestCartId);
  }

  @Query(() => [EnrichedCartItem])
  @UseGuards(OptionalGqlAuthGuard)
  async selectedCartItems(
    @Args('guestCartId', { nullable: true }) guestCartId?: string,
    @CurrentUser() user?: CurrentJwtUser,
  ): Promise<EnrichedCartItem[]> {
    return this.cartService.getSelectedItems(user?.id, guestCartId);
  }
}
