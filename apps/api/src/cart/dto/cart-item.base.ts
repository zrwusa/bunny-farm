// cart-item.base.ts
import { Field, Int, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export abstract class CartItemBase {
  @Field()
  skuId: string;

  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;
}
