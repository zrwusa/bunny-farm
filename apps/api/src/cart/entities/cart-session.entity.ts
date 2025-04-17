import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType()
@Entity('cart_sessions')
export class CartSession extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cartSessions, { eager: true })
  user: User;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (item) => item.session, { cascade: true, eager: true })
  items: CartItem[];
}
