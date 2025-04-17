import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreateProductInput {
  @Field()
  name!: string;

  @Field()
  brandId!: string;

  @Field()
  price!: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  description?: object;
}
