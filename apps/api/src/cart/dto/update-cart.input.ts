import { Field, InputType } from '@nestjs/graphql';
import { CartItemInput } from './cart-item.input';

@InputType()
export class UpdateCartInput {
  @Field(() => String)
  id: string;

  @Field(() => [CartItemInput], { nullable: true })
  items?: CartItemInput[];
}
