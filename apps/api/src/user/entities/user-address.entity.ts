import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@ObjectType()
@Entity({ name: 'user_addresses' })
export class UserAddress extends BaseEntity {
  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @Field()
  @Column()
  recipientName: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @Column()
  addressLine1: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  addressLine2: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  postalCode: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column({ default: false })
  isDefault: boolean;
}
