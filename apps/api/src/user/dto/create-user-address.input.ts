import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserAddressInput {
  @Field()
  recipientName: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  @IsEmail()
  email: string;

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
