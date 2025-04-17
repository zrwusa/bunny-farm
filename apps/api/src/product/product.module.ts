import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductResolver } from './product.resolver';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
// import { InventoryRecordResolver } from './inventory-record.resolver';
// import { InventoryService } from './inventory.service';
// import { ProductVariantResolver } from './product-variant.resolver';
import { ProductReviewLoader } from './loaders/product-review.loader';
import { ProductReview } from './entities/product-review.entity';
import { SearchModule } from '../search/search.module';
import { SearchService } from '../search/search.service';

@Module({
  imports: [
    // Entities are required to be converted via TypeOrmModule.forFeature() into modules through the imports field to tell NestJS these as modules injection. After that, @InjectRepository() is required to cooperate in the constructor. The repositories that are dependencies in providers also need to be imported as well.
    TypeOrmModule.forFeature([
      Product,
      // InventoryRecord,
      ProductReview,
    ]),
    SearchModule,
  ], // The core function of TypeOrmModule.forFeature is to convert the specified entities into an Injectable Provider and register them into NestJS's dependency injection container. These converted Repositories can be directly injected into your services without the need to manually add them to the providers array.
  // The class marked by @Injectable() is not injected as modules dependencies, but is directly specified in providers, and does not require @InjectRepository() or @Inject to specify explicitly.
  providers: [
    ProductResolver,
    ProductService,
    // InventoryService,
    // InventoryRecordResolver,
    // ProductVariantResolver,
    ProductReviewLoader,
    SearchService,
  ],
})

// How to use InventoryService in ProductService (How to use another module's service class in the service class)
// 1. In the InventoryModule exports: [InventoryService], so that it can be used by other modules.
// 2. Imports: [InventoryModule] in ProductModule, so that Inject InventoryService can be used in ProductService.
// 3. Inject InventoryService directly into ProductService, and it can be used normally.
export class ProductModule {}
