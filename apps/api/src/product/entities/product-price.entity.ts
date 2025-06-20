import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { SKU } from './sku.entity';

@ObjectType()
@Entity('product_prices')
export class ProductPrice extends BaseEntity {
  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number; // price

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  validFrom?: Date; // Price effective time (can be used for promotion)

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  validTo?: Date; // Price expiration time

  @Field(() => SKU)
  @ManyToOne(() => SKU, (sku) => sku.prices, {
    onDelete: 'CASCADE',
  })
  sku!: SKU; // Related product skus
}
