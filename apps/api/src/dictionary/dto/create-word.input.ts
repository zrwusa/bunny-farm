import { Field, InputType } from '@nestjs/graphql';
import { CreateVariantInput } from './create-variant.input';
import { CreateMorphemeInput } from './create-morpheme.input';

@InputType()
export class PublishWordInput {
  @Field()
  text!: string;

  @Field(() => [CreateVariantInput], { nullable: true })
  variants?: CreateVariantInput[];

  @Field(() => [CreateMorphemeInput], { nullable: true })
  morphemes?: CreateMorphemeInput[];
}
