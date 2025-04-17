import { Field, ObjectType } from '@nestjs/graphql';
import { UserPreference } from './user-preference.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { EmailField, UsernameField } from '../../common';
import { Order } from '../../order/entities/order.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserProfile } from './user-profile.entity';
import { UserAddress } from './user-address.entity';
import { UserPaymentMethod } from './user-payment-method.entity';
import { ProductReview } from '../../product/entities/product-review.entity';
import { CartSession } from '../../cart/entities/cart-session.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseEntity {
  @Column()
  @UsernameField()
  @Field()
  username: string;

  @Column()
  @EmailField()
  @Field()
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  provider?: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  providerId?: string;

  @Field(() => UserPreference, { nullable: true })
  @OneToOne(() => UserPreference, (preference) => preference.user, {
    cascade: true,
    eager: true,
  })
  preference?: UserPreference;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  @Field(() => UserProfile, { nullable: true })
  profile?: UserProfile;

  @OneToMany(() => UserAddress, (address) => address.user, { cascade: true })
  @Field(() => [UserAddress], { nullable: true })
  addresses?: UserAddress[];

  @OneToMany(() => UserPaymentMethod, (payment) => payment.user, {
    cascade: true,
  })
  @Field(() => [UserPaymentMethod], { nullable: true })
  paymentMethods?: UserPaymentMethod[];

  @OneToMany(() => Order, (order) => order.user)
  @Field(() => [Order], { nullable: true })
  orders?: Order[];

  @OneToMany(() => ProductReview, (review) => review.user)
  @Field(() => [ProductReview], { nullable: true })
  reviews?: ProductReview[];

  @Field(() => [CartSession], { nullable: true })
  @OneToMany(() => CartSession, (session) => session.user)
  cartSessions?: CartSession[];
}
