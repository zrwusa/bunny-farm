import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemQuantityInput {
  @Field(() => String)
  skuId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => String, { nullable: true })
  clientCartId?: string;
}
