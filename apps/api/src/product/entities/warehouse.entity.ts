import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Inventory } from './inventory.entity';

@ObjectType()
@Entity('warehouses')
export class Warehouse extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 255 })
  name!: string; // Warehouse name

  @Field()
  @Column({ type: 'varchar', length: 255 })
  location!: string; // Warehouse location (address or city)

  @Field(() => [Inventory])
  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  inventories!: Inventory[]; // Inventory of this warehouse
}
