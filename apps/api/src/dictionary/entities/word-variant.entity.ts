import { BaseEntity } from '../../common/entities/base.entity';
import { Word } from './word.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { VariantAttribute } from './variant-attribute.entity';
import { ExampleSentence } from './example-sentence.entity';
import { VariantSynonym } from './variant-synonym.entity';
import { PartOfSpeech } from '../../common/enums';

registerEnumType(PartOfSpeech, { name: 'PartOfSpeech' });

@Entity({ name: 'dictionary_variants' })
@ObjectType()
export class WordVariant extends BaseEntity {
  @ManyToOne(() => Word, (word) => word.variants, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Field(() => Word)
  word!: Word;

  @Field(() => PartOfSpeech)
  @Column()
  partOfSpeech!: PartOfSpeech;

  @Field()
  @Column()
  definition!: string;

  @Field()
  @Column()
  definitionZh!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  pronunciationUk?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  pronunciationUs?: string;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isSpoken!: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  isWritten!: boolean;

  @Field(() => VariantAttribute, { nullable: true })
  @OneToOne(() => VariantAttribute, (attr) => attr.variant, {
    cascade: true,
    eager: true,
  })
  attributes?: VariantAttribute;

  @Field(() => [ExampleSentence])
  @OneToMany(() => ExampleSentence, (sentence) => sentence.variant, {
    cascade: true,
    eager: true,
  })
  examples!: ExampleSentence[];

  @Field(() => [VariantSynonym])
  @OneToMany(() => VariantSynonym, (syn) => syn.variant, {
    cascade: true,
    eager: true,
  })
  synonyms!: VariantSynonym[];
}
