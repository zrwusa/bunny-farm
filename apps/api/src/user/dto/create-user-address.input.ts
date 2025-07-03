import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserAddressInput {
  @Field()
  recipientName: string;

  @Field()
  phone: string;

  @Field()
  addressLine1: string;

  @Field({ nullable: true })
  addressLine2?: string;

  @Field({ nullable: true })
  suburb?: string;

  @Field()
  city: string;

  @Field()
  postalCode: string;

  @Field()
  country: string;

  @Field({ defaultValue: false })
  isDefault: boolean;
}
