import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductReview } from './entities/product-review.entity';
import { ProductReviewLoader } from './loaders/product-review.loader';

@Resolver(() => ProductVariant)
export class ProductVariantResolver {
  constructor(private readonly productReviewLoader: ProductReviewLoader) {}

  @ResolveField(() => [ProductReview])
  async reviews(@Parent() variant: ProductVariant) {
    return this.productReviewLoader.loadVariantReviews(variant.id);
  }
}
