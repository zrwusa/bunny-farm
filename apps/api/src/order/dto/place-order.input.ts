import { Field, ID, InputType } from '@nestjs/graphql';
import { PaymentMethod } from '../../common/enums';
import { CartItemInput } from '../../cart/dto/cart-item.input';

@InputType()
export class PlaceOrderInput {
  @Field(() => ID)
  addressId: string;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => [CartItemInput])
  items: CartItemInput[];
}
