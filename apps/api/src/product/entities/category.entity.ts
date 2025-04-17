import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity('categories')
export class Category extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string; // Category Name

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string; // Classification Description

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent?: Category; // Advanced classification

  @Field(() => [Category])
  @OneToMany(() => Category, (category) => category.parent, {})
  subcategories!: Category[]; // Subcategory

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.category)
  products!: Product[]; // Products under this category
}
