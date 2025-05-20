import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { CreateOauthUserInput } from './dto/create-oauth-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: string) {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  async create(createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const newUser = this.userRepo.create({
      ...createUserInput,
      password: hashedPassword,
    });
    return this.userRepo.save(newUser);
  }

  createOAuthUser(createOauthUserInput: CreateOauthUserInput) {
    const newUser = this.userRepo.create(createOauthUserInput);
    return this.userRepo.save(newUser);
  }

  findById(id: string) {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  findByProviderId(provider: string, providerId: string) {
    return this.userRepo.findOne({
      where: { provider, providerId },
    });
  }
}
