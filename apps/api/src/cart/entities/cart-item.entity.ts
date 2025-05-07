import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType()
@Entity('cart_items')
export class CartItem extends BaseEntity {
  @Field(() => Cart, { nullable: true })
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart?: Cart;

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
