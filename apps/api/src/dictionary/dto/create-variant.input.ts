import { Field, InputType } from '@nestjs/graphql';
import { CreateExampleInput } from './create-example.input';
import { CreateAttributeInput } from './create-attribute.input';
import { PartOfSpeech } from '../../common/enums';
import { CreateSynonymInput } from './create-synonym.input';

@InputType()
export class CreateVariantInput {
  @Field(() => PartOfSpeech)
  partOfSpeech!: PartOfSpeech;

  @Field()
  definition!: string;

  @Field()
  definitionZh!: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  pronunciationUk?: string;

  @Field({ nullable: true })
  pronunciationUs?: string;

  @Field({ defaultValue: false })
  isSpoken!: boolean;

  @Field({ defaultValue: false })
  isWritten!: boolean;

  @Field(() => CreateAttributeInput, { nullable: true })
  attributes?: CreateAttributeInput;

  @Field(() => [CreateExampleInput], { nullable: true })
  examples?: CreateExampleInput[];

  @Field(() => [CreateSynonymInput], { nullable: true })
  synonyms?: CreateSynonymInput[];
}
