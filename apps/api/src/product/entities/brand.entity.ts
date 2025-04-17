import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity('brands')
export class Brand extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string; // Brand Name

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string; // Brand description

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.brand)
  products!: Product[]; // Products under this brand
}
