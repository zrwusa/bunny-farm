import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field({ description: 'User Id' })
  userId: string;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}

@InputType()
export class OrderItemInput {
  @Field(() => String, { description: 'Sku Ids' })
  skuId: string;

  @Field(() => Int, { description: 'Quantity of the product(s)' })
  quantity: number;
}
