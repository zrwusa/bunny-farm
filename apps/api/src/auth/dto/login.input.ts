import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  type: 'local' | 'google' | 'github';

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  oauthToken?: string;
}
