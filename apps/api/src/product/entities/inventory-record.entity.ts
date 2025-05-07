import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { InventoryType } from '../../common/enums';
import { Order } from '../../order/entities/order.entity';
import { SKU } from './sku.entity';

registerEnumType(InventoryType, {
  name: 'InventoryType',
});

@Entity({ name: 'inventory_records' })
@ObjectType()
export class InventoryRecord extends BaseEntity {
  // TODO many to one relationship needs to be reconsidered, should it be with Inventory or with Sku.
  @Field(() => SKU)
  @ManyToOne(() => SKU, (sku) => sku.inventoryRecords, {
    onDelete: 'CASCADE',
  })
  sku: SKU;

  @Field(() => Int)
  @Column({ type: 'int' })
  changeQuantity: number; // The positive number indicates the warehouse, the negative number indicates the warehouse out

  @Field(() => InventoryType)
  @Column({ type: 'enum', enum: InventoryType })
  type: InventoryType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  reason?: string; // Extra description, such as order number, supplier, etc.

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, { nullable: true }) // Related orders only when leaving the warehouse
  order?: Order;
}
