import { Field, InputType } from '@nestjs/graphql';
import {
  AgeGroup,
  Connotation,
  EmotionalIntensity,
  PartOfSpeech,
  WordFrequency,
} from '../../common/enums';

@InputType()
export class CreateSynonymInput {
  @Field(() => String)
  text?: string;

  @Field({ nullable: true })
  definition?: string;

  @Field({ nullable: true })
  definitionZh?: string;

  @Field({ defaultValue: false })
  isSpoken?: boolean;

  @Field({ defaultValue: false })
  isWritten?: boolean;

  @Field(() => PartOfSpeech, { nullable: true })
  partOfSpeech?: PartOfSpeech;

  @Field(() => WordFrequency, { nullable: true })
  frequency?: WordFrequency; // 1~5

  @Field(() => EmotionalIntensity, { nullable: true })
  emotionalIntensity?: EmotionalIntensity; // 1~5

  @Field(() => Connotation, { nullable: true })
  connotation?: Connotation; // 1(negative) ~ 5(positive)

  @Field(() => AgeGroup, { nullable: true })
  acquisitionAge?: AgeGroup;
}
