import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CartSession } from './cart-session.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType()
@Entity('cart_items')
export class CartItem extends BaseEntity {
  @Field(() => CartSession, { nullable: true })
  @ManyToOne(() => CartSession, (session) => session.items, { onDelete: 'CASCADE' })
  session?: CartSession;

  @Field(() => String)
  @Column()
  productId: string;

  @Field(() => String)
  @Column()
  skuId: string;

  @Field(() => Int)
  @Column('int')
  quantity: number;

  @Field(() => Boolean)
  @Column({ default: true })
  selected: boolean;
}
