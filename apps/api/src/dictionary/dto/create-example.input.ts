import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateExampleInput {
  @Field()
  sentence!: string;

  @Field()
  translationZh!: string;

  @Field()
  isSpoken!: boolean;
}
