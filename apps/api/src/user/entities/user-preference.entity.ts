import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from './user.entity';

@Entity({ name: 'user_preferences' })
@ObjectType()
export class UserPreference extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ default: false })
  @Field({ defaultValue: false })
  receiveNotifications: boolean;

  @Column({ default: false })
  @Field({ defaultValue: false })
  receiveEmails: boolean;
}
