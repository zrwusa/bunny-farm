import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SameSite as SameSiteType } from '@bunny/shared';

export enum SameSite {
  Lax = 'lax',
  Strict = 'strict',
  None = 'none',
}

registerEnumType(SameSite, {
  name: 'SameSite',
});

@ObjectType()
export class TokenMeta {
  @Field(() => Number)
  maxAge: number;

  @Field(() => Boolean)
  httpOnly: boolean;

  @Field(() => Boolean)
  secure: boolean;

  // GraphQL does not support union types directly, so we use String to allow 'boolean | SameSite'
  @Field(() => String, { nullable: true })
  sameSite?: SameSiteType;

  @Field(() => String, { nullable: true })
  domain?: string;
}

@ObjectType()
export class TokenOutput {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => TokenMeta)
  accessTokenMeta: TokenMeta;

  @Field(() => TokenMeta)
  refreshTokenMeta: TokenMeta;
}
