import { CreateShipmentInput } from './create-shipment.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateShipmentInput extends PartialType(CreateShipmentInput) {
  @Field(() => Int)
  id: number;
}
