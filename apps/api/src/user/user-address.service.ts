import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from './entities/user-address.entity';
import { Repository } from 'typeorm';
import { CreateUserAddressInput } from './dto/create-user-address.input';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly addressRepo: Repository<UserAddress>,
  ) {}

  async findByUserId(userId: string): Promise<UserAddress[]> {
    return this.addressRepo.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC' }, // The default address is in front
    });
  }

  async create(userId: string, input: CreateUserAddressInput): Promise<UserAddress> {
    if (input.isDefault) {
      // If the default address is set, first cancel the default for all other addresses of the user first.
      await this.addressRepo.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false },
      );
    }

    const address = this.addressRepo.create({
      ...input,
      user: { id: userId },
    });

    return this.addressRepo.save(address);
  }
}
