// dto/redis-cart.object.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CartItem } from '../entities/cart-item.entity';
import { DeviceType } from '../../common/enums';
import { User } from '../../user/entities/user.entity';

@ObjectType('CachedCart')
export class CachedCart {
  @Field(() => ID)
  id: string;

  @Field(() => User, { nullable: true })
  user: User | null;

  @Field(() => String, { nullable: true })
  clientCartId?: string;

  @Field(() => DeviceType)
  deviceType: DeviceType;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
