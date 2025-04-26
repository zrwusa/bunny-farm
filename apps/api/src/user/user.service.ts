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
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async create(createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  createOAuthUser(createOauthUserInput: CreateOauthUserInput) {
    const newUser = this.usersRepository.create(createOauthUserInput);
    return this.usersRepository.save(newUser);
  }

  findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  findByProviderId(provider: string, providerId: string) {
    return this.usersRepository.findOne({
      where: { provider, providerId },
    });
  }
}
