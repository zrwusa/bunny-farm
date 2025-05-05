import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { RedisService } from '../redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartSession } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let redisService: RedisService;
  let cartSessionRepository: Repository<CartSession>;
  let cartItemRepository: Repository<CartItem>;
  let userRepository: Repository<User>;

  const mockRedisService = {
    deleteCart: jest.fn(),
    getCart: jest.fn(),
    setCart: jest.fn(),
  };

  const mockCartSessionRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCartItemRepository = {
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: getRepositoryToken(CartSession),
          useValue: mockCartSessionRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartItemRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    redisService = module.get<RedisService>(RedisService);
    cartSessionRepository = module.get<Repository<CartSession>>(getRepositoryToken(CartSession));
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('clearCart', () => {
    const mockCart = {
      id: 'cart-123',
      user: {
        id: 'user-123',
      },
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          skuId: 'sku-1',
          quantity: 2,
        },
      ],
    };

    beforeEach(() => {
      // Reset all mock functions
      jest.clearAllMocks();

      // Set mock return values
      mockCartSessionRepository.findOne.mockResolvedValue(mockCart);
      mockCartSessionRepository.find.mockResolvedValue([mockCart]);
      mockCartSessionRepository.delete.mockResolvedValue({ affected: 1 });
      mockCartItemRepository.delete.mockResolvedValue({ affected: 1 });
    });

    it('should delete cart from Redis', async () => {
      await service.clearCart('cart-123');

      expect(redisService.deleteCart).toHaveBeenCalledWith('cart:user:user-123');
    });

    it('should asynchronously delete cart from database', async () => {
      await service.clearCart('cart-123');

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(cartSessionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-123' } },
        relations: ['items'],
      });

      expect(cartItemRepository.delete).toHaveBeenCalledWith({
        session: { id: 'cart-123' },
      });

      expect(cartSessionRepository.delete).toHaveBeenCalledWith({
        user: { id: 'user-123' },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockCartSessionRepository.find.mockRejectedValue(new Error('Database error'));

      await service.clearCart('cart-123');

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redis operation should complete even if database operation fails
      expect(redisService.deleteCart).toHaveBeenCalled();
    });

    it('should return success response', async () => {
      const result = await service.clearCart('cart-123');

      expect(result).toEqual({ success: true });
    });

    it('should handle non-existent cart', async () => {
      mockCartSessionRepository.findOne.mockResolvedValue(null);

      await expect(service.clearCart('non-existent-cart')).rejects.toThrow(NotFoundException);
    });
  });
});
