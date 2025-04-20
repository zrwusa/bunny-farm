import { Field, InputType } from '@nestjs/graphql';
import { CartItemInput } from './cart-item.input';

@InputType()
export class CreateCartInput {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => [CartItemInput])
  items: CartItemInput[];
}
