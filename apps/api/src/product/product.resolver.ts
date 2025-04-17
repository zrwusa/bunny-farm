import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { ProductService } from './product.service';
import { ProductReviewLoader } from './loaders/product-review.loader';
import { ProductReview } from './entities/product-review.entity';
import { PublishProductInput } from './dto/publish-product.input';

@Resolver(() => Product) // When we use @ResolveField() to parse Product-related fields (for example, reviews()), () => Product is necessary.
export class ProductResolver {
  constructor(
    private readonly productService: ProductService, // In NestJS, almost all dependency injection objects (Service, Repository, Loader, etc.) should be readonly, because: these objects are essentially singletons, and their life cycles are managed by NestJS and should always remain unchanged. It does not need to be reassigned, so readonly ensures that it will not be modified, in line with the design philosophy of NestJS。
    private readonly productReviewLoader: ProductReviewLoader,
  ) {}

  @ResolveField(() => [ProductReview])
  async reviews(@Parent() product: Product) {
    return this.productReviewLoader.loadProductReviews(product.id);
  }

  @Query(() => Product, { name: 'product', nullable: true })
  getProductById(@Args('id') id: string) {
    return this.productService.findOne(id);
  }

  @Query(() => [Product], { name: 'products' })
  getProducts() {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productService.create(createProductInput);
  }

  @Mutation(() => Product)
  publishProduct(@Args('publishProductInput') publishProductInput: PublishProductInput) {
    return this.productService.publishProduct(publishProductInput);
  }

  @Mutation(() => Boolean)
  async bulkIndexProducts() {
    await this.productService.bulkIndexProducts();
    return true;
  }

  @Query(() => [Product])
  async searchProducts(@Args('keyword') keyword: string) {
    return this.productService.searchProducts(keyword);
  }

  @Query(() => [String])
  async suggestProductNames(@Args('input') input: string) {
    return this.productService.suggestProductNames(input);
  }
}
