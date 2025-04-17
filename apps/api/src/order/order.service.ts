import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FilterOrderInput } from './dto/filter-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderInput } from './dto/create-order.input';
import { User } from '../user/entities/user.entity';
import { OrderItem } from './entities/order-item.entity';
import { InventoryRecord } from '../product/entities/inventory-record.entity';
import { InventoryType, OrderStatus } from '../common/enums';
import { PaymentService } from '../payment/payment.service';
import { ProductVariant } from '../product/entities/product-variant.entity';

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
      for (const { variantId, quantity } of createOrderInput.items) {
        const variant = await manager.findOneBy(ProductVariant, {
          id: variantId,
        });

        if (!variant) throw new NotFoundException(`Product variant ID ${variantId} not found`);

        // Calculate the current inventory
        const totalStock = await manager
          .createQueryBuilder(InventoryRecord, 'inventory_records')
          .where('inventory_records.variant_id = :variantId', {
            variantId,
          })
          .select('SUM(inventory_records.change_quantity)', 'totalStock')
          .getRawOne<{ totalStock: string }>();

        if ((Number(totalStock.totalStock) || 0) < quantity) {
          throw new BadRequestException(`Product variant ${variant.product.name} is out of stock`);
        }
        const price = variant.prices[0].price;
        const subtotal = price * quantity;
        order.totalPrice += subtotal;

        // Create an order product item
        const orderItem = manager.create(OrderItem, {
          variant,
          quantity,
          price,
        });
        order.items.push(orderItem);

        // Create inventory exit record
        const inventoryRecord = manager.create(InventoryRecord, {
          variant,
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

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number, updateOrderInput: UpdateOrderInput) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
