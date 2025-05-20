import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterOrderInput } from './dto/filter-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderInput } from './dto/create-order.input';
import { User } from '../user/entities/user.entity';
import { OrderItem } from './entities/order-item.entity';
import { InventoryRecord } from '../product/entities/inventory-record.entity';
import { InventoryType, OrderStatus, PaymentStatus, ShippingStatus } from '../common/enums';
import { PaymentService } from '../payment/payment.service';
import { SKU } from '../product/entities/sku.entity';
import { PlaceOrderInput } from './dto/place-order.input';
import { UserAddress } from '../user/entities/user-address.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { CartService } from '../cart/cart.service';

// TODO 7. Order Fulfillment
//  The seller or warehouse processes the order:
//  For physical products: Items are packed and shipped.
//  For digital products: Download links or access credentials are provided.
// TODO 8. Shipping & Tracking (If Applicable)
//  The user receives a tracking number and can monitor the delivery status.
//  Notifications are sent for shipping updates.
// TODO 9. Order Delivery
//  The product is delivered to the user.
//  The user may need to confirm receipt.
// TODO 10. Post-Order Actions
//  The user can leave reviews and ratings.
//  They may request returns, refunds, or exchanges based on the policy.
//  The app may send follow-up emails for feedback or upselling.

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly paymentService: PaymentService,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRedis() private readonly redis: Redis,
    private readonly cartService: CartService,
  ) {}

  async create(createOrderInput: CreateOrderInput) {
    const { userId } = createOrderInput;
    const order = await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const inventoryRecords: InventoryRecord[] = [];
      // Create an order
      const order = manager.create(Order, {
        user,
        status: OrderStatus.PENDING,
        totalPrice: 0,
        items: [] as OrderItem[],
      });
      for (const { skuId, quantity } of createOrderInput.items) {
        const sku = await manager.findOneBy(SKU, {
          id: skuId,
        });

        if (!sku) throw new NotFoundException(`Product sku ID ${skuId} not found`);

        // Calculate the current inventory
        const totalStock = await manager
          .createQueryBuilder(InventoryRecord, 'inventory_records')
          .where('inventory_records.sku_id = :skuId', {
            skuId,
          })
          .select('SUM(inventory_records.change_quantity)', 'totalStock')
          .getRawOne<{ totalStock: string }>();

        if (Number(totalStock?.totalStock ?? 0) < quantity) {
          throw new BadRequestException(`Product sku ${sku.product.name} is out of stock`);
        }
        const price = sku.prices[0].price;
        const subtotal = price * quantity;
        order.totalPrice += subtotal;

        // Create an order product item
        const orderItem = manager.create(OrderItem, {
          sku,
          quantity,
          price,
        });
        order.items.push(orderItem);

        // Create inventory exit record
        const inventoryRecord = manager.create(InventoryRecord, {
          sku,
          changeQuantity: -quantity, // Negative number indicates the warehouse
          type: InventoryType.SALE,
          order,
        });
        inventoryRecords.push(inventoryRecord);
      }

      await manager.save(order);
      for (const op of order.items) {
        op.order = order;
        await manager.save(op);
      }

      // Save inventory record
      for (const inv of inventoryRecords) {
        inv.order = order;
        await manager.save(inv);
      }

      return order;
    });

    // Immediately generate payment orders after the order is created
    const payment = await this.paymentService.create(order.id);
    order.payments = [payment];

    // TODO 6. Order Confirmation. The app sends an order confirmation via email or notification, including order details and estimated delivery time.
    return order;
  }

  findAll({ page, pageSize }: FilterOrderInput) {
    // TODO 1. Browsing & Product Selection.
    //  The user explores the product catalog, using filters and search functions.
    //  They view product details, including price, description, images, and reviews.
    // TODO 2. Adding to Cart
    //  The user adds desired items to their shopping cart.
    //  They can modify quantities, remove items, or apply discount codes.
    // TODO 3. Checkout Process
    //  The user proceeds to checkout and selects:
    //  Shipping address (if applicable)
    //  Billing details
    //  Payment method (credit card, PayPal, digital wallets, etc.)
    //  The system calculates the total cost, including taxes and shipping fees.
    // TODO 4. Order Placement
    //  The user confirms the order, and the system creates an order record in the database.
    //  A payment transaction is initiated (if required).
    return this.orderRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
    });
  }

  async placeOrder(userId: string, input: PlaceOrderInput): Promise<Order> {
    const lockKey = `lock:order:${userId}`;
    const LOCK_DURATION_MS = 5000;

    // Redis distributed lock (prevents users from repeatedly placing orders)
    const lockResult = await this.redis.set(lockKey, 'locked', 'PX', LOCK_DURATION_MS, 'NX');

    if (lockResult !== 'OK') {
      throw new BadRequestException('Please try again later');
    }

    // Use TypeORM's QueryRunner to start a manual transaction
    // All database operations are completed within this transaction to ensure data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneOrFail(User, {
        where: { id: userId },
      });

      // Verify whether the address belongs to the user
      await queryRunner.manager.findOneOrFail(UserAddress, {
        where: { id: input.addressId, user: { id: userId } },
      });

      let totalPrice = 0;
      const items: OrderItem[] = [];

      for (const item of input.items) {
        const sku = await queryRunner.manager.findOneOrFail(SKU, {
          where: { id: item.skuId },
          relations: ['product', 'inventories', 'prices'],
        });

        const product = sku.product;

        // Accumulated inventory
        const totalAvailable = sku.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
        if (totalAvailable < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name} (${sku.color}/${sku.size})`,
          );
        }

        // Deduct inventory from multiple inventory records one by one
        let qtyToDeduct = item.quantity;
        for (const inventory of sku.inventories) {
          if (qtyToDeduct === 0) break;
          const deduct = Math.min(qtyToDeduct, inventory.quantity);
          inventory.quantity -= deduct;
          qtyToDeduct -= deduct;
          await queryRunner.manager.save(inventory);
        }

        const unitPrice = sku.prices[0]?.price || 0;
        const orderItem = this.orderItemRepo.create({
          sku,
          quantity: item.quantity,
          price: unitPrice,
        });

        items.push(orderItem);
        totalPrice += Number(unitPrice) * item.quantity;
      }

      const order = this.orderRepo.create({
        user,
        items,
        totalPrice,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        shippingStatus: ShippingStatus.PENDING,
        paymentMethod: input.paymentMethod,
      });

      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      await this.cartService.removeItems(
        items.map((i) => i.sku.id),
        userId,
      );
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err.message);
    } finally {
      // Release Redis Lock & Release Connection
      await queryRunner.release();
      await this.redis.del(lockKey);
    }
  }
}
