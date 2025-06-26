import { Field, InputType } from '@nestjs/graphql';
import { CreateMorphemeRelatedWordInput } from './create-morpheme-related-word.input';

@InputType()
export class CreateMorphemeInput {
  @Field()
  text!: string;

  @Field()
  meaningEn!: string;

  @Field()
  meaningZh!: string;

  @Field({ defaultValue: false })
  isRoot!: boolean;

  @Field({ defaultValue: false })
  isPrefix!: boolean;

  @Field({ defaultValue: false })
  isSuffix!: boolean;

  @Field(() => [CreateMorphemeRelatedWordInput])
  relatedWords!: CreateMorphemeRelatedWordInput[];
}
