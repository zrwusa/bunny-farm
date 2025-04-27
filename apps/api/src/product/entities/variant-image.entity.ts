import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { ProductVariant } from './product-variant.entity';

@ObjectType()
@Entity('variant_images')
export class VariantImage extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 500 })
  url!: string; // Image URL

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  position?: number; // Image sorting location

  @Field(() => ProductVariant)
  @ManyToOne(() => ProductVariant, (variant) => variant.images, {
    onDelete: 'CASCADE',
  })
  variant!: ProductVariant; // Related Variants
}
