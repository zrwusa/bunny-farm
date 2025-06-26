import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Word } from './word.entity';
import { MorphemeWord } from './morpheme-related-word.entity';

@Entity({ name: 'dictionary_morphemes' })
@ObjectType()
export class Morpheme extends BaseEntity {
  @Field()
  @Column()
  text!: string;

  @Field()
  @Column()
  meaningEn!: string;

  @Field()
  @Column()
  meaningZh!: string;

  @Field()
  @Column({ default: false })
  isRoot!: boolean;

  @Field()
  @Column({ default: false })
  isPrefix!: boolean;

  @Field()
  @Column({ default: false })
  isSuffix!: boolean;

  @ManyToMany(() => Word, (word) => word.morphemes, {
    onDelete: 'CASCADE',
  })
  words!: Word[];

  @Field(() => [MorphemeWord])
  @OneToMany(() => MorphemeWord, (word) => word.morpheme, {
    cascade: true,
    eager: true,
  })
  relatedWords!: MorphemeWord[];
}
