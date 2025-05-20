import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { UserPreference } from './entities/user-preference.entity';
import { UserPreferenceService } from './user-preference.service';
import { UserService } from './user.service';
import { UserPreferenceResolver } from './user-preference.resolver';
import { UserAddressResolver } from './user-address.resolver';
import { UserAddressService } from './user-address.service';
import { UserAddress } from './entities/user-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPreference, UserAddress])], // The core function of TypeOrmModule.forFeature is to convert the specified entities into an Injectable Provider and register them into NestJS's dependency injection container. These converted Repositories can be directly injected into your services without the need to manually add them to the providers array.
  providers: [
    UserService,
    UserResolver,
    UserPreferenceService,
    UserPreferenceResolver,
    UserAddressResolver,
    UserAddressService,
  ],
  exports: [UserService],
})
export class UsersModule {}
