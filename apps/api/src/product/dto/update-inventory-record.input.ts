import { CreateInventoryRecordInput } from './create-inventory-record.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInventoryRecordInput extends PartialType(CreateInventoryRecordInput) {
  @Field(() => Int)
  id: number;
}
