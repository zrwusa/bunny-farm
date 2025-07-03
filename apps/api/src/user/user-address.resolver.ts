import { UserAddress } from './entities/user-address.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentJwtUser } from '../auth/types/types';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressInput } from './dto/create-user-address.input';

@Resolver(() => UserAddress)
export class UserAddressResolver {
  constructor(private readonly addressService: UserAddressService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserAddress])
  async myAddresses(@CurrentUser() user: CurrentJwtUser): Promise<UserAddress[]> {
    return this.addressService.findByUserId(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserAddress)
  async addMyAddress(
    @CurrentUser() user: CurrentJwtUser,
    @Args('input') input: CreateUserAddressInput,
  ): Promise<UserAddress> {
    return this.addressService.create(user.id, input);
  }
}
