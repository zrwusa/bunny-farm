import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UserPreference } from './user/entities/user-preference.entity';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { PaymentModule } from './payment/payment.module';
import { InventoryRecord } from './product/entities/inventory-record.entity';
import { Payment } from './payment/entities/payment.entity';
import { AppResolver } from './app.resolver';
import { UserProfile } from './user/entities/user-profile.entity';
import { UserAddress } from './user/entities/user-address.entity';
import { UserPaymentMethod } from './user/entities/user-payment-method.entity';
import { ShipmentModule } from './shipment/shipment.module';
import { Shipment } from './shipment/entities/shipment.entity';
import { Category } from './product/entities/category.entity';
import { Inventory } from './product/entities/inventory.entity';
import { ProductImage } from './product/entities/product-image.entity';
import { ProductPrice } from './product/entities/product-price.entity';
import { ProductReview } from './product/entities/product-review.entity';
import { SKU } from './product/entities/sku.entity';
import { Warehouse } from './product/entities/warehouse.entity';
import { Brand } from './product/entities/brand.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SearchModule } from './search/search.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { SkuImage } from './product/entities/sku-image.entity';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { PlaceModule } from './place/place.module';
import { GqlContext } from './types/graphql';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MonitoringModule } from './monitoring/monitoring.module';
import { PerformanceInterceptor } from './monitoring/interceptors/performance.interceptor';
import { DictionaryModule } from './dictionary/dictionary.module';
import { Word } from './dictionary/entities/word.entity';
import { ExampleSentence } from './dictionary/entities/example-sentence.entity';
import { VariantAttribute } from './dictionary/entities/variant-attribute.entity';
import { VariantSynonym } from './dictionary/entities/variant-synonym.entity';
import { Morpheme } from './dictionary/entities/word-morpheme.entity';
import { WordVariant } from './dictionary/entities/word-variant.entity';
import { MorphemeWord } from './dictionary/entities/morpheme-related-word.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available throughout the application
      envFilePath: (() => {
        switch (process.env.NODE_ENV) {
          case 'production':
            return '.env.production';
          case 'test':
            return '.env.test';
          default:
            return '.env.development';
        }
      })(),
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MonitoringModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/generated/schema.gql', // Automatically generate GraphQL schema and save it to a file
      debug: process.env.APOLLO_DEBUG === 'true', // Enable debugging mode to log detailed GraphQL execution info
      playground: process.env.GRAPHQL_PLAYGROUND === 'true', // Enable GraphQL Playground for in-browser query testing
      introspection: process.env.GRAPHQL_PLAYGROUND === 'true', // Allow introspection queries to fetch schema details
      context: ({ req, res }: GqlContext) => ({ req, res }),
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return error;
      },
    }),
    TypeOrmModule.forRootAsync({
      // TypeORM must wait for ConfigModule to parse .env to be properly initialized, so forRootAsync() is the best practice over forRoot()
      imports: [ConfigModule], // ConfigModule.forRoot() has been introduced globally in AppModule's imports. In theory, imports: [ConfigModule] can be omitted, but it is recommended to retain them to ensure stability.
      useFactory: async (configService: ConfigService) => {
        // Transform non-injectable objects into providers using useValue and useFactory
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: +configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USERNAME'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [
            User,
            UserPreference,
            UserProfile,
            UserAddress,
            UserPaymentMethod,
            Product,
            Brand,
            Category,
            Cart,
            CartItem,
            Inventory,
            ProductImage,
            ProductPrice,
            ProductReview,
            SKU,
            SkuImage,
            Warehouse,
            Order,
            OrderItem,
            InventoryRecord,
            Payment,
            Shipment,
            Word,
            ExampleSentence,
            VariantAttribute,
            VariantSynonym,
            Morpheme,
            MorphemeWord,
            WordVariant,
          ],
          migrations: ['src/migrations/*{.ts,.js}'],
          synchronize: configService.get('TYPEORM_SYNCHRONIZE') === 'true', // For development only, production environments should use migrations
          namingStrategy: new SnakeNamingStrategy(),
          logging: ['error', 'warn', 'query', 'schema'], //Turn on SQL query and error logging
          logger: 'advanced-console',
          maxQueryExecutionTime: 50, // highlights those exceeding maxQueryExecutionTime
        };
      },
      inject: [ConfigService], // The useFactory of forRootAsync cannot directly access the global ConfigService, and must be explicitly injected
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService): RedisModuleOptions => ({
        type: 'single',
        url: configService.get('REDIS_URL'),
        // options: {
        //   host: configService.get('REDIS_HOST'),
        //   port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
        //   password: configService.get('REDIS_PASSWORD'),
        // },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(), // Start a timing task
    UsersModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    ShipmentModule,
    SearchModule,
    CartModule,
    AuthModule,
    PlaceModule,
    DictionaryModule,
  ],
  controllers: [],
  providers: [
    AppResolver,
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule {}
