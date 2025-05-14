import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
// import { CreateOrderInput } from './dto/create-order.input';
// import { UpdateOrderInput } from './dto/update-order.input';
import { FilterOrderInput } from './dto/filter-order.input';
import { CreateOrderInput } from './dto/create-order.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PlaceOrderInput } from './dto/place-order.input';
import { CurrentJwtUser } from '../auth/types/types';

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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  async placeOrder(
    @CurrentUser() user: CurrentJwtUser,
    @Args('input') input: PlaceOrderInput,
  ): Promise<Order> {
    // Why is it not recommended to place an order by "reading the check option directly from Redis"?
    // Although the selected status is available in Redis, the risk of directly reading the Redis check option when placing an order is:
    // 1. The order and Redis status that the user expects may be out of sync
    // After the user checks the front-end page, the back-end Redis status update is asynchronous;
    // The front-end may have clicked "Submit Order" before the Redis write is completed, and the result is that it is not the latest status read;
    // This is a "state inconsistency" problem.
    // 2. Redis state is "mutable" and lacks stability
    // Redis is a cache, not an authoritative data source;
    // The user may log in on multiple devices, and the Redis status has been modified on another port, causing the check option you read on this end to change;
    // Some extreme situations will cause the user to "think A was placed, but in the end, he actually placed A + B".
    // 3. Not conducive to idempotence and log audit
    // If you do not explicitly pass in the item, but instead let the backend dynamically decide "what items to order" from Redis, then:
    // There will be no "clear order content" in the client request log;
    // Idepotency control (such as hashing to judge repeated submissions) cannot be achieved;
    // It is difficult to check when users complain or retrospectively.
    return this.orderService.placeOrder(user.id, input);
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
