import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';
import { Inventory } from './inventory.entity';
import { ProductPrice } from './product-price.entity';
import { ProductReview } from './product-review.entity';
import { InventoryRecord } from './inventory-record.entity';
import { SkuImage } from './sku-image.entity';

@ObjectType()
@Entity('skus')
export class SKU extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50 })
  color!: string; // color

  @Field()
  @Column({ type: 'varchar', length: 20 })
  size!: string; // size

  @Field({ nullable: true })
  @Column({ nullable: true })
  skuCode?: string;

  @Field(() => [ProductPrice])
  @OneToMany(() => ProductPrice, (productPrice) => productPrice.sku, {
    eager: true,
    cascade: true,
  })
  prices!: ProductPrice[]; // prices

  @Field(() => [SkuImage])
  @OneToMany(() => SkuImage, (image) => image.sku, {
    eager: true,
    cascade: true,
  })
  images!: SkuImage[]; // Product pictures

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.skus, {
    onDelete: 'CASCADE',
  })
  product!: Product; // Related Product

  @Field(() => [Inventory])
  @OneToMany(() => Inventory, (inventory) => inventory.sku, {
    eager: true,
    cascade: true,
  })
  inventories!: Inventory[]; // Associated inventory

  @Field(() => [InventoryRecord])
  @OneToMany(() => InventoryRecord, (inventoryRecord) => inventoryRecord.sku, {
    eager: true,
    cascade: true,
  })
  inventoryRecords!: InventoryRecord[];

  @Field(() => [ProductReview])
  @OneToMany(() => ProductReview, (review) => review.sku, {
    lazy: true,
    // cascade: true,
  })
  reviews!: ProductReview[]; // Sku Reviews
}
