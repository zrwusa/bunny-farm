import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';
import { User } from '../../user/entities/user.entity';
import { ProductVariant } from './product-variant.entity';

@ObjectType()
@Entity('product_reviews')
export class ProductReview extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  user!: User; // Rating user

  @Field(() => Int)
  @Column({ type: 'int', default: 5 })
  rating!: number; // Rating (1-5)

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string; // Review content

  @Field(() => Product, { nullable: true })
  @ManyToOne(() => Product, (product) => product.reviews, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  product?: Product; // Related Product

  @Field(() => ProductVariant, { nullable: true })
  @ManyToOne(() => ProductVariant, (variant) => variant.reviews, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  variant?: ProductVariant; // Related Variant
}
