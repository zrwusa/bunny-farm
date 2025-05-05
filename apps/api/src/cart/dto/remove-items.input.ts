import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveItemsInput {
  @Field(() => [String])
  skuIds: string[];

  @Field(() => String, { nullable: true })
  clientCartId?: string;
}
