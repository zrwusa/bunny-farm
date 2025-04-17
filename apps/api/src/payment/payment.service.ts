import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { Payment } from './entities/payment.entity';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../common/enums';
import { UpdatePaymentInput } from './dto/update-payment.input';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in a payable state');
    }

    // Simulation payment creation (actually the payment gateway should be called)
    const payment = this.paymentRepository.create({
      order,
      amount: order.totalPrice,
      status: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    });
    // Generate payment link
    payment.url = await this.generatePaymentUrl(payment);
    await this.paymentRepository.save(payment);

    // Return to payment link
    return payment;
  }

  async confirm(paymentId: string, status: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });
    if (!payment) throw new NotFoundException('Payment not found');

    if (status === 'success') {
      payment.status = PaymentStatus.PAID;
      payment.paymentTime = new Date();
      await this.paymentRepository.save(payment);

      // Update order status
      const order = payment.order;
      order.status = OrderStatus.PAID;
      await this.orderRepository.save(order);
    } else {
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
    }

    return payment;
  }

  findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentInput: UpdatePaymentInput) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async refund(orderId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['order'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Only successful payments can be refunded');
    }

    // Simulation refund (actually the payment gateway should be called)
    payment.status = PaymentStatus.REFUNDED;
    await this.paymentRepository.save(payment);

    // Update order status
    const order = payment.order;
    order.status = OrderStatus.REFUNDED;
    await this.orderRepository.save(order);

    return payment;
  }

  private async generatePaymentUrl(payment: Payment) {
    return `https://mock-payment-gateway.com/pay?paymentId=${payment.id}&amount=${payment.amount}`;
  }
}
