import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of orders with products', async () => {
      const mockOrders: Order[] = [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: null,
          items: [],
          status: 'Pending',
          paymentStatus: 'Pending',
          shippingStatus: 'Pending',
          paymentMethod: 'Credit Card',
          totalPrice: 100.0,
          setId: jest.fn(),
        } as Order,
        {
          id: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: null,
          items: [],
          status: 'Completed',
          paymentStatus: 'Paid',
          shippingStatus: 'Shipped',
          paymentMethod: 'Paypal',
          totalPrice: 200.0,
          setId: jest.fn(),
        } as Order,
      ];

      const findMock = jest.spyOn(orderRepository, 'find').mockResolvedValue(mockOrders);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(findMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['products'],
      });

      expect(result).toEqual(mockOrders);
    });
  });
});
