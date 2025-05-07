import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SKU } from './entities/sku.entity';
import { ProductReview } from './entities/product-review.entity';
import { ProductReviewLoader } from './loaders/product-review.loader';

@Resolver(() => SKU)
export class SKUResolver {
  constructor(private readonly productReviewLoader: ProductReviewLoader) {}

  @ResolveField(() => [ProductReview])
  async reviews(@Parent() sku: SKU) {
    return this.productReviewLoader.loadSkuReviews(sku.id);
  }
}
