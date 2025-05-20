import { UserAddress } from './entities/user-address.entity';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentJwtUser } from '../auth/types/types';
import { UserAddressService } from './user-address.service';

@Resolver(() => UserAddress)
export class UserAddressResolver {
  constructor(private readonly addressService: UserAddressService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserAddress])
  async myAddresses(@CurrentUser() user: CurrentJwtUser): Promise<UserAddress[]> {
    return this.addressService.findByUserId(user.id);
  }
}
