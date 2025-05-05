import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { DeviceType } from '../../common/enums';

registerEnumType(DeviceType, { name: 'DeviceType' });

@ObjectType()
@Entity('carts')
export class Cart extends BaseEntity {
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.carts, { eager: true, nullable: true })
  user?: User;

  @Column()
  @Field(() => String)
  clientCartId?: string;

  @Field(() => DeviceType)
  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.WEB,
  })
  deviceType: DeviceType;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (item) => item.session, { cascade: true, eager: true })
  items: CartItem[];
}
