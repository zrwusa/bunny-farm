import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 500 })
  url!: string; // Image URL

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  position?: number; // Image sorting location

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product!: Product; // Related Products
}
