import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => Payment)
  createPayment(@Args('createPaymentInput') createPaymentInput: CreatePaymentInput) {
    return this.paymentService.create(createPaymentInput.orderId);
  }

  @Mutation(() => Payment)
  async confirmPayment(@Args('paymentId') paymentId: string, @Args('status') status: string) {
    return this.paymentService.confirm(paymentId, status);
  }

  @Query(() => [Payment], { name: 'payments' })
  getPayments() {
    return this.paymentService.findAll();
  }

  @Query(() => Payment, { name: 'payment' })
  getPaymentById(@Args('id', { type: () => Int }) id: number) {
    return this.paymentService.findOne(id);
  }

  @Mutation(() => Payment)
  updatePayment(@Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput) {
    return this.paymentService.update(updatePaymentInput.id, updatePaymentInput);
  }

  @Mutation(() => Payment)
  removePayment(@Args('id', { type: () => Int }) id: number) {
    return this.paymentService.remove(id);
  }
}
