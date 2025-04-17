import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { PaymentMethod, PaymentStatus } from '../../common/enums';
import { BaseEntity } from '../../common/entities/base.entity';

registerEnumType(PaymentMethod, { name: 'PaymentMethod' });
registerEnumType(PaymentStatus, { name: 'PaymentStatus' });

@Entity('payments')
@ObjectType()
export class Payment extends BaseEntity {
  @ManyToOne(() => Order, { eager: true })
  @Field(() => Order)
  order: Order;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  @Field({ nullable: true })
  url: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  amount: number;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  paymentTime: Date;
}
