import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { WordVariant } from './word-variant.entity';
import {
  AgeGroup,
  Connotation,
  EmotionalIntensity,
  PartOfSpeech,
  WordFrequency,
} from '../../common/enums';

@Entity({ name: 'dictionary_variant_synonyms' })
@ObjectType()
export class VariantSynonym extends BaseEntity {
  @ManyToOne(() => WordVariant, (variant) => variant.synonyms, {
    onDelete: 'CASCADE',
  })
  @Field(() => WordVariant)
  variant!: WordVariant;

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
  synonymVariant?: WordVariant;
}
