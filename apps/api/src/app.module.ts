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
import { ProductVariant } from './product/entities/product-variant.entity';
import { Warehouse } from './product/entities/warehouse.entity';
import { Brand } from './product/entities/brand.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SearchModule } from './search/search.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { CartSession } from './cart/entities/cart-session.entity';
import { CartItem } from './cart/entities/cart-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available throughout the application
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/generated/schema.gql', // Automatically generate GraphQL schema and save it to a file
      debug: true, // Enable debugging mode to log detailed GraphQL execution info
      playground: true, // Enable GraphQL Playground for in-browser query testing
      introspection: true, // Allow introspection queries to fetch schema details
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
            CartSession,
            CartItem,
            Inventory,
            ProductImage,
            ProductPrice,
            ProductReview,
            ProductVariant,
            Warehouse,
            Order,
            OrderItem,
            InventoryRecord,
            Payment,
            Shipment,
          ],
          migrations: ['src/migrations/*{.ts,.js}'],
          synchronize: true, // For development only, production environments should use migrations
          namingStrategy: new SnakeNamingStrategy(),
          logging: ['query', 'error'], //Turn on SQL query and error logging
        };
      },
      inject: [ConfigService], // The useFactory of forRootAsync cannot directly access the global ConfigService, and must be explicitly injected
    }),
    UsersModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    ShipmentModule,
    SearchModule,
    CartModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
