// apps/api/src/cart/dto/cart-item.input.ts
import { Field, InputType} from '@nestjs/graphql';
import { CartItemBase } from './cart-item.base';

@InputType()
export class CartItemInput extends CartItemBase {
  @Field()
  selected: boolean;
}
