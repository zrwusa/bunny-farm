import { Field, InputType } from '@nestjs/graphql';
import { CartItemInput } from './cart-item.input';

@InputType()
export class AddItemToCartInput {
  @Field(() => CartItemInput)
  item: CartItemInput;

  @Field(() => String, { nullable: true })
  clientCartId?: string;
}
