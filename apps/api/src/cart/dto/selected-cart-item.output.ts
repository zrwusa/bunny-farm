import { Field, ObjectType } from '@nestjs/graphql';
import { CartItemBase } from './cart-item.base';

@ObjectType()
export class SelectedCartItemOutput extends CartItemBase {
  @Field({ nullable: true })
  selected?: boolean;
}
