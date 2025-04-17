import { Field, InputType } from '@nestjs/graphql';
import { CartItemInput } from './cart-item.input';

@InputType()
export class CreateCartInput {
  @Field(() => String)
  userId: string;

  @Field(() => [CartItemInput])
  items: CartItemInput[];
}
