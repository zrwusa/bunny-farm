import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { AgeGroup } from '../../common/enums';
import { WordVariant } from './word-variant.entity';
import { Morpheme } from './word-morpheme.entity';

registerEnumType(AgeGroup, { name: 'AgeGroup' });

@ObjectType()
@Entity({ name: 'dictionary_words' })
@ObjectType()
export class Word extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  text!: string; // Word body (such as run)

  @Field(() => [WordVariant])
  @OneToMany(() => WordVariant, (variant) => variant.word, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  variants!: WordVariant[];

  @ManyToMany(() => Morpheme, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  @Field(() => [Morpheme])
  morphemes!: Morpheme[];
}
