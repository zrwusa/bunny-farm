import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductReview } from '../entities/product-review.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductReviewLoader {
  public readonly batchReviews = new DataLoader(
    async (keys: { type: 'product' | 'sku'; id: string }[]) => {
      // Step 1: Separate the IDs of Product and SKU
      const productIds = keys.filter((k) => k.type === 'product').map((k) => k.id);
      const skuIds = keys.filter((k) => k.type === 'sku').map((k) => k.id);

      // Step 2: Batch query Product and SKU related Reviews
      const reviews = await this.reviewRepository.find({
        where: [
          ...(productIds.length ? [{ product: { id: In(productIds) } }] : []),
          ...(skuIds.length ? [{ sku: { id: In(skuIds) } }] : []),
        ],
        relations: ['product', 'sku'],
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
        } else if (review.sku) {
          reviewMap[`sku:${review.sku.id}`].push(review);
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
   * Helper function to load SKU reviews
   */
  public loadSkuReviews(skuId: string) {
    return this.batchReviews.load({ type: 'sku', id: skuId });
  }
}
