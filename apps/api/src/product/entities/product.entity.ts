import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductReview } from './product-review.entity';
import { GraphQLJSONObject } from 'graphql-type-json';

@Entity({ name: 'products' })
@ObjectType()
export class Product extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 255 })
  name!: string; // Product Name

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  description?: object; // Product Description

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
    cascade: true,
  })
  category?: Category; // Product Category

  @Field(() => Brand, { nullable: true })
  @ManyToOne(() => Brand, (brand) => brand.products, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
    cascade: true,
  })
  brand?: Brand; // Product Brand

  @Field(() => [ProductVariant])
  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    eager: true,
    cascade: true,
  })
  variants!: ProductVariant[]; // Variations of the product (color, size, etc.)

  @Field(() => [ProductImage])
  @OneToMany(() => ProductImage, (image) => image.product, {
    eager: true,
    cascade: true,
  })
  images!: ProductImage[]; // Product pictures

  @Field(() => [ProductReview])
  @OneToMany(() => ProductReview, (review) => review.product, {
    lazy: true,
  })
  reviews!: ProductReview[]; // Product Reviews
}
