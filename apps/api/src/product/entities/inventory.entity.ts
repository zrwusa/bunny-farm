import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { SKU } from './sku.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity('inventories')
@Unique(['sku', 'warehouse']) // sku warehouse only
// In addition to saving information, inventories table also plays the role of a junction table, connecting product_skus (product skus) and warehouses (warehouses), thus establishing a many-to-many relationship.
export class Inventory extends BaseEntity {
  @Field()
  @Column({ type: 'int', default: 0 })
  quantity!: number; // Current inventory quantity

  @Field(() => SKU)
  @ManyToOne(() => SKU, (sku) => sku.inventories, {
    onDelete: 'CASCADE',
  })
  sku!: SKU; // Related product skus

  @Field(() => Warehouse)
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
    eager: true,
    onDelete: 'CASCADE',
  })
  warehouse!: Warehouse; // Related warehouse
}
