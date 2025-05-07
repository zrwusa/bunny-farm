import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { SKU } from '../../product/entities/sku.entity';

@Entity('order_items')
@ObjectType()
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @Field(() => Order)
  order: Order;

  @Field(() => SKU)
  @ManyToOne(() => SKU, { eager: true, onDelete: 'CASCADE' })
  sku: SKU;

  @Column()
  @Field(() => Int)
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float, {
    description: 'The total price of the current quantity of products',
  })
  price: number;
}
