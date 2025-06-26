import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import {
  AgeGroup,
  Connotation,
  EmotionalIntensity,
  PartOfSpeech,
  WordFrequency,
} from '../../common/enums';
import { Morpheme } from './word-morpheme.entity';
import { WordVariant } from './word-variant.entity';

@Entity({ name: 'dictionary_morpheme_related_words' })
@ObjectType()
export class MorphemeWord extends BaseEntity {
  @ManyToOne(() => Morpheme, (morpheme) => morpheme.relatedWords, {
    onDelete: 'CASCADE',
  })
  @Field(() => Morpheme)
  morpheme!: Morpheme;

  @Field()
  @Column()
  text!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  definition?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  definitionZh?: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isSpoken?: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isWritten?: boolean;

  @Field(() => PartOfSpeech, { nullable: true })
  @Column({ nullable: true })
  partOfSpeech?: PartOfSpeech;

  @Field(() => WordFrequency, { nullable: true })
  @Column({ nullable: true, type: 'int' })
  frequency?: WordFrequency; // 1~5

  @Field(() => EmotionalIntensity, { nullable: true })
  @Column({ nullable: true, type: 'int' })
  emotionalIntensity?: EmotionalIntensity; // 1~5

  @Field(() => Connotation, { nullable: true })
  @Column({ nullable: true, type: 'int' })
  connotation?: Connotation; // 1(negative) ~ 5(positive)

  @Field(() => AgeGroup, { nullable: true })
  @Column({ nullable: true })
  acquisitionAge?: AgeGroup;

  @Field(() => [WordVariant])
  @ManyToOne(() => WordVariant, { nullable: true })
  relatedWordVariant?: WordVariant;
}
