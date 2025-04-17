import { Field, InputType } from '@nestjs/graphql';
import { Gender } from '../../common/enums';

@InputType()
export class UserProfileInput {
  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;
}
