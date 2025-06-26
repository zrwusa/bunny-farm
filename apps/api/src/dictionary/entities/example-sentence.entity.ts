import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { WordVariant } from './word-variant.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'dictionary_example_sentences' })
@ObjectType()
export class ExampleSentence extends BaseEntity {
  @ManyToOne(() => WordVariant, (variant) => variant.examples, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Field(() => WordVariant)
  variant!: WordVariant;

  @Field()
  @Column()
  sentence!: string;

  @Field()
  @Column()
  translationZh!: string;

  @Field()
  @Column({ default: false })
  isSpoken!: boolean;
}
