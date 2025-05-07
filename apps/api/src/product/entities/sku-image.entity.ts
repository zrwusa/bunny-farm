import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { SKU } from './sku.entity';

@ObjectType()
@Entity('sku_images')
export class SkuImage extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 500 })
  url!: string; // Image URL

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  position?: number; // Image sorting location

  @Field(() => SKU)
  @ManyToOne(() => SKU, (sku) => sku.images, {
    onDelete: 'CASCADE',
  })
  sku!: SKU; // Related Skus
}
