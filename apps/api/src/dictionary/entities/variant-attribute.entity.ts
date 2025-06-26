import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { WordVariant } from './word-variant.entity';
import { AgeGroup, Connotation, EmotionalIntensity, WordFrequency } from '../../common/enums';

registerEnumType(AgeGroup, {
  name: 'AgeGroup',
  description: 'Age at which native speakers typically acquire the word',
});

registerEnumType(WordFrequency, {
  name: 'WordFrequency',
});

registerEnumType(Connotation, {
  name: 'Connotation',
});

registerEnumType(EmotionalIntensity, {
  name: 'EmotionalIntensity',
});

@Entity({ name: 'dictionary_variant_attributes' })
@ObjectType()
export class VariantAttribute extends BaseEntity {
  @OneToOne(() => WordVariant, (variant) => variant.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  variant!: WordVariant;

  @Field()
  @Column({ type: 'int' })
  frequency!: WordFrequency; // 1~5

  @Field()
  @Column({ type: 'int' })
  emotionalIntensity!: EmotionalIntensity; // 1~5

  @Field(() => Connotation)
  @Column({ type: 'int' })
  connotation!: Connotation; // 1(negative) ~ 5(positive)

  @Field(() => AgeGroup)
  @Column()
  acquisitionAge!: AgeGroup;
}
