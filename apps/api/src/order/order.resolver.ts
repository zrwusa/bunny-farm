import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
// import { CreateOrderInput } from './dto/create-order.input';
// import { UpdateOrderInput } from './dto/update-order.input';
import { FilterOrderInput } from './dto/filter-order.input';
import { CreateOrderInput } from './dto/create-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  getOrders(@Args('filterOrderInput') filterOrderInput: FilterOrderInput) {
    return this.orderService.findAll(filterOrderInput);
  }

  // @Query(() => Order, { name: 'order' })
  // getOrderById(@Args('id', { type: () => Int }) id: number) {
  //   return this.orderService.findOne(id);
  // }

  // @Mutation(() => Order)
  // updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
  //   return this.orderService.update(updateOrderInput.id, updateOrderInput);
  // }

  // @Mutation(() => Order)
  // removeOrder(@Args('id', { type: () => Int }) id: number) {
  //   return this.orderService.remove(id);
  // }
}
