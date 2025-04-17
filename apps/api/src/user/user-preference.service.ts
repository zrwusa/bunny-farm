import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { User } from './entities/user.entity';
import { CreateUserPreferenceInput } from './dto/create-user-preference.input';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectRepository(UserPreference)
    private userSettingsRepository: Repository<UserPreference>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(userId: string) {
    // return this.userSettingsRepository.findOneBy({ user: userId });
  }

  async create(createUserPreferenceInput: CreateUserPreferenceInput) {
    const findUser = await this.userRepository.findOneBy({
      id: createUserPreferenceInput.userId,
    });

    if (!findUser) throw new Error('User Not Found');

    const newUserSetting = this.userSettingsRepository.create(createUserPreferenceInput);
    const savedSettings = await this.userSettingsRepository.save(newUserSetting);

    findUser.preference = savedSettings;
    await this.userRepository.save(findUser);

    return savedSettings;
  }
}
