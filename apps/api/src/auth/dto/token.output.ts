import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenMeta {
  @Field(() => Number)
  accessTokenMaxAge: number;

  @Field(() => Number)
  refreshTokenMaxAge: number;
}

@ObjectType()
export class TokenOutput {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => TokenMeta)
  tokenMeta: TokenMeta;
}
