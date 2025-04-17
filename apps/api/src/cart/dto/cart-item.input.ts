import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CartItemInput {
  @Field(() => String)
  productId: string;

  @Field(() => String)
  skuId: string;

  @Field(() => Int)
  quantity: number;
} 