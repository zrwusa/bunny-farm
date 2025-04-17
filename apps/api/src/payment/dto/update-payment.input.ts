import { CreatePaymentInput } from './create-payment.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @Field(() => Int)
  id: number;
}
