// apps/api/src/cart/dto/cart-item.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CartItemInput {
  @Field()
  skuId: string;

  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field({ defaultValue: true })
  selected?: boolean;
}
