import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Gender } from '../../common/enums';
import { BaseEntity } from '../../common/entities/base.entity';

registerEnumType(Gender, { name: 'Gender' });

@ObjectType()
@Entity({ name: 'user_profiles' })
export class UserProfile extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;
}
