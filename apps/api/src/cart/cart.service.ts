import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { CartSession } from './entities/cart-session.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartSession)
    private cartSessionRepository: Repository<CartSession>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createCartInput: CreateCartInput) {
    const { userId, items } = createCartInput;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create cart session
    const cartSession = this.cartSessionRepository.create({ user });
    await this.cartSessionRepository.save(cartSession);

    // Add cart items
    if (items && items.length > 0) {
      const cartItems = items.map(item =>
        this.cartItemRepository.create({
          session: cartSession,
          productId: item.productId,
          skuId: item.skuId,
          quantity: item.quantity,
        })
      );
      await this.cartItemRepository.save(cartItems);
    }

    return this.findOne(cartSession.id);
  }

  async findAll() {
    return this.cartSessionRepository.find({
      relations: ['items', 'user'],
    });
  }

  async findOne(id: string) {
    const cart = await this.cartSessionRepository.findOne({
      where: { id },
      relations: ['items', 'user'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async findByUserId(userId: string) {
    return this.cartSessionRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'user'],
    });
  }

  async update(id: string, updateCartInput: UpdateCartInput) {
    const cart = await this.findOne(id);

    if (updateCartInput.items) {
      // Remove existing cart items
      await this.cartItemRepository.delete({ session: { id } });

      // Add new cart items
      const cartItems = updateCartInput.items.map(item =>
        this.cartItemRepository.create({
          session: cart,
          productId: item.productId,
          skuId: item.skuId,
          quantity: item.quantity,
        })
      );
      await this.cartItemRepository.save(cartItems);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const cart = await this.findOne(id);
    await this.cartSessionRepository.remove(cart);
    return cart;
  }

  async clearCart(id: string) {
    const cart = await this.findOne(id);
    await this.cartItemRepository.delete({ session: { id } });
    return this.findOne(id);
  }
}
