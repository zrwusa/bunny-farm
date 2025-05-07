import { CartItem } from '../entities/cart-item.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../../product/entities/product.entity';
import { SKU } from '../../product/entities/sku.entity';

@ObjectType()
export class EnrichedCartItem extends CartItem {
  @Field({ nullable: true })
  product?: Product;

  @Field({ nullable: true })
  sku?: SKU;
}
