import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { ProductVariant } from './product-variant.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity('inventories')
@Unique(['variant', 'warehouse']) // sku warehouse only
// In addition to saving information, inventories table also plays the role of a junction table, connecting product_variants (product variants) and warehouses (warehouses), thus establishing a many-to-many relationship.
export class Inventory extends BaseEntity {
  @Field()
  @Column({ type: 'int', default: 0 })
  quantity!: number; // Current inventory quantity

  @Field(() => ProductVariant)
  @ManyToOne(() => ProductVariant, (variant) => variant.inventories, {
    onDelete: 'CASCADE',
  })
  variant!: ProductVariant; // Related product variants

  @Field(() => Warehouse)
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
    eager: true,
    onDelete: 'CASCADE',
  })
  warehouse!: Warehouse; // Related warehouse
}
