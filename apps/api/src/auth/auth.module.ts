// apps/api/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
// import { forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleOAuthService } from './google-oauth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieModule } from '../core/cookie.module';
// import { OptionalGqlAuthGuard } from './guards/optional-gql-auth.guard';
// import { GqlAuthGuard } from './guards/gql-auth.guard';

@Module({
  imports: [
    UsersModule,
    // forwardRef(() => UsersModule),
    PassportModule,
    CookieModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    GoogleOAuthService,
    JwtStrategy,
    // GqlAuthGuard,
    // OptionalGqlAuthGuard,
  ],
  exports: [
    AuthService,
    // GqlAuthGuard,
    // OptionalGqlAuthGuard,
  ],
})
export class AuthModule {}
