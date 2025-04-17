import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';
import { Inventory } from './inventory.entity';
import { ProductPrice } from './product-price.entity';
import { ProductReview } from './product-review.entity';
import { InventoryRecord } from './inventory-record.entity';

@ObjectType()
@Entity('product_variants')
@Unique(['sku']) // SKU requires unique
export class ProductVariant extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  sku!: string; // Only SKU (Inventory Unit）

  @Field()
  @Column({ type: 'varchar', length: 50 })
  color!: string; // color

  @Field()
  @Column({ type: 'varchar', length: 20 })
  size!: string; // size

  @Field(() => [ProductPrice])
  @OneToMany(() => ProductPrice, (productPrice) => productPrice.variant, {
    eager: true,
    cascade: true,
  })
  prices!: ProductPrice[]; // prices

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product!: Product; // Related Product

  @Field(() => [Inventory])
  @OneToMany(() => Inventory, (inventory) => inventory.variant, {
    eager: true,
    cascade: true,
  })
  inventories!: Inventory[]; // Associated inventory

  @Field(() => [InventoryRecord])
  @OneToMany(() => InventoryRecord, (inventoryRecord) => inventoryRecord.variant, {
    eager: true,
    cascade: true,
  })
  inventoryRecords!: InventoryRecord[];

  @Field(() => [ProductReview])
  @OneToMany(() => ProductReview, (review) => review.variant, {
    lazy: true,
    // cascade: true,
  })
  reviews!: ProductReview[]; // Variant Reviews
}
