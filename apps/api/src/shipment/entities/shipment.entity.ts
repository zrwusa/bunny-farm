import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Carrier, ShipmentStatus } from '../../common/enums';
import { BaseEntity } from '../../common/entities/base.entity';

registerEnumType(ShipmentStatus, { name: 'ShipmentStatus' });
registerEnumType(Carrier, { name: 'Carrier' });

@Entity('shipments')
@ObjectType()
export class Shipment extends BaseEntity {
  @ManyToOne(() => Order, { eager: true })
  @Field(() => Order)
  order: Order;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING,
  })
  @Field(() => ShipmentStatus)
  status: ShipmentStatus;

  @Column({
    type: 'enum',
    enum: Carrier,
  })
  @Field(() => Carrier)
  carrier: Carrier;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  trackingNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  estimatedDelivery: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  shippedAt: Date;
}
