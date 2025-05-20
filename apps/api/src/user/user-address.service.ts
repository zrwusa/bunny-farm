import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from './entities/user-address.entity';
import { Repository } from 'typeorm';

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
}
