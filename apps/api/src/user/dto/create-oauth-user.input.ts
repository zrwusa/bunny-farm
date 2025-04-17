import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Gender } from '../../common/enums';

registerEnumType(Gender, { name: 'Gender' });

@InputType()
export class UserProfileInput {
  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  gender?: Gender;
}

@InputType()
export class CreateOauthUserInput {
  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  provider: string;

  @Field()
  providerId: string;

  @Field(() => UserProfileInput, { nullable: true })
  profile?: UserProfileInput;
}
