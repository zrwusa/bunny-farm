// dto/redis-cart.object.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DeviceType } from '../../common/enums';
import { User } from '../../user/entities/user.entity';
import { EnrichedCartItem } from './enriched-cart-item.object';

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

  @Field(() => [EnrichedCartItem])
  items: EnrichedCartItem[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
