import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductReview } from '../entities/product-review.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductReviewLoader {
  public readonly batchReviews = new DataLoader(
    async (keys: { type: 'product' | 'variant'; id: string }[]) => {
      // Step 1: Separate the IDs of Product and ProductVariant
      const productIds = keys.filter((k) => k.type === 'product').map((k) => k.id);
      const variantIds = keys.filter((k) => k.type === 'variant').map((k) => k.id);

      // Step 2: Batch query Product and ProductVariant related Reviews
      const reviews = await this.reviewRepository.find({
        where: [
          ...(productIds.length ? [{ product: { id: In(productIds) } }] : []),
          ...(variantIds.length ? [{ variant: { id: In(variantIds) } }] : []),
        ],
        relations: ['product', 'variant'],
      });

      // Step 3: Create Map to store query results
      const reviewMap: { [key: string]: ProductReview[] } = {};
      keys.forEach(({ type, id }) => {
        reviewMap[`${type}:${id}`] = []; // Make sure that each key has at least one empty array
      });

      // Step 4: Classification Review to Map
      reviews.forEach((review) => {
        if (review.product) {
          reviewMap[`product:${review.product.id}`].push(review);
        } else if (review.variant) {
          reviewMap[`variant:${review.variant.id}`].push(review);
        }
      });

      // Step 5: Return results in the order of keys
      return keys.map(({ type, id }) => reviewMap[`${type}:${id}`]);
    },
  );

  constructor(
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
  ) {}

  /**
   * Helper function to load Product reviews
   */
  public loadProductReviews(productId: string) {
    return this.batchReviews.load({ type: 'product', id: productId });
  }

  /**
   * Helper function to load ProductVariant reviews
   */
  public loadVariantReviews(variantId: string) {
    return this.batchReviews.load({ type: 'variant', id: variantId });
  }
}
