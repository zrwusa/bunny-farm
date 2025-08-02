import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemQuantityInput {
  @Field(() => String)
  skuId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => String, { nullable: true })
  guestCartId?: string;
}

@InputType()
export class ToggleItemSelectionInput {
  @Field(() => String)
  skuId: string;

  @Field(() => Boolean)
  selected: boolean;

  @Field(() => String, { nullable: true })
  guestCartId?: string;
}
