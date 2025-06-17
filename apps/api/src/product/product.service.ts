import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { PublishProductInput } from './dto/publish-product.input';
import { Warehouse } from './entities/warehouse.entity';
import { SearchService } from '../search/search.service';
import { SearchProductDto } from '../search/dto/search-product.dto';
import { LoggerService } from '../shared/logger.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly searchService: SearchService,
    private readonly logger: LoggerService,
  ) {}

  static transformProductToSearchDto({
    id,
    name,
    description,
    category,
    brand,
    skus,
  }: Product): SearchProductDto {
    return {
      id: id.toString(),
      name,
      description: description || {},
      category: category?.name || '',
      brand: brand?.name || '',
      skus: skus?.map((v) => v.size) || [],
      suggest: {
        input: [name],
        weight: 1,
      },
    };
  }

  findAll() {
    return this.productRepo.find({
      order: {
        images: { position: 'ASC' },
        // TODO doesn't really work for deep nested order
        // skus: { images: { position: 'ASC' } }
      },
    });
  }

  findMany(ids: string[]) {
    return this.productRepo.findBy({
      id: In(ids),
    });
  }

  findOne(id: string) {
    return this.productRepo.findOne({
      where: { id },
      order: { images: { position: 'ASC' } },
    });
  }

  create(createProductInput: CreateProductInput) {
    const { brandId } = createProductInput;
    if (!brandId) throw new BadRequestException('Brand ID is required');
    const newProduct = this.productRepo.create(createProductInput);
    return this.productRepo.save(newProduct);
  }

  async publishProduct(publishProductInput: PublishProductInput) {
    return await this.dataSource.transaction(async (manager) => {
      const brandRepo = manager.getRepository(Brand);
      const categoryRepo = manager.getRepository(Category);
      const productRepo = manager.getRepository(Product);
      const warehouseRepo = manager.getRepository(Warehouse);

      // Handle Brand (supports id or name)
      const {
        brand: { id: brandId, name: brandName },
      } = publishProductInput;

      let brand: Brand | null = null;

      if (brandId) {
        brand = await brandRepo.findOne({ where: { id: brandId } });
        if (!brand) throw new NotFoundException(`Brand with id ${brandId} not found`);
      } else {
        brand =
          (await brandRepo.findOne({ where: { name: brandName } })) ||
          brandRepo.create({ name: brandName });
      }

      // Handle Category (supports id or name)
      const {
        category: { id: categoryId, name: categoryName },
      } = publishProductInput;
      let category: Category | null = null;

      if (categoryId) {
        category = await categoryRepo.findOne({
          where: { id: categoryId },
        });
        if (!category) throw new NotFoundException(`Category with id ${categoryId} not found`);
      } else {
        category =
          (await categoryRepo.findOne({ where: { name: categoryName } })) ??
          categoryRepo.create({ name: categoryName });
      }

      // Handle Skus & Inventories
      const skus = await Promise.all(
        publishProductInput.skus.map(async (skuInput) => {
          const inventories = await Promise.all(
            (skuInput.inventories ?? []).map(async (inventoryInput) => {
              const { warehouse: warehouseInput } = inventoryInput;
              let warehouse: Warehouse | null = null;

              if (warehouseInput.id) {
                warehouse = await warehouseRepo.findOne({
                  where: { id: warehouseInput.id },
                });
                if (!warehouse)
                  throw new NotFoundException(`Warehouse with id ${warehouseInput.id} not found`);
              } else {
                if (!warehouseInput.name || !warehouseInput.location) {
                  throw new BadRequestException(
                    `Warehouse must have both name and location if id is not provided`,
                  );
                }
                warehouse =
                  (await warehouseRepo.findOne({
                    where: {
                      name: warehouseInput.name,
                      location: warehouseInput.location,
                    },
                  })) ||
                  warehouseRepo.create({
                    name: warehouseInput.name,
                    location: warehouseInput.location,
                  });
              }

              return {
                quantity: inventoryInput.quantity,
                warehouse,
              };
            }),
          );

          return {
            ...skuInput,
            inventories,
          };
        }),
      );

      // Create Product
      const product = productRepo.create({
        ...publishProductInput,
        brand,
        category,
        skus,
      });

      return productRepo.save(product);
    });
  }

  // Batch synchronized products (optional for timing tasks)
  async bulkIndexProducts(products?: Product[]) {
    if (products === undefined) products = await this.findAll();
    const searchProducts = products.map(ProductService.transformProductToSearchDto);
    return this.searchService.bulkIndexProducts(searchProducts);
  }

  async searchProducts(query: string) {
    const searchResults = await this.searchService.searchProducts(query);

    const productIds = searchResults.map((hit) => hit._id);

    const products = await this.productRepo.find({
      where: { id: In(productIds) },
      order: { images: { position: 'ASC' } },
    });
    this.logger.log(`Products searched: ${products.length} products`);

    return products;
  }

  async suggestProductNames(input: string) {
    const suggestOptions = await this.searchService.suggestProducts(input);
    return suggestOptions.map((opt) => opt._source?.name ?? '');
  }
}
