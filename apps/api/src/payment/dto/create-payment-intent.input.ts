import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePaymentIntentInput {
  @Field(() => Int, { description: 'amount of cents' })
  amountOfCents: number;

  @Field(() => String, { description: 'currency type, eg. NZD' })
  currency: string;
}
