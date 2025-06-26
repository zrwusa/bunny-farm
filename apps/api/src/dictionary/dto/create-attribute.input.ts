import { Field, InputType } from '@nestjs/graphql';
import { AgeGroup, Connotation, EmotionalIntensity, WordFrequency } from '../../common/enums';

@InputType()
export class CreateAttributeInput {
  @Field(() => WordFrequency)
  frequency!: WordFrequency;

  @Field(() => EmotionalIntensity)
  emotionalIntensity!: EmotionalIntensity;

  @Field(() => Connotation)
  connotation!: Connotation;

  @Field(() => AgeGroup)
  acquisitionAge!: AgeGroup;
}
