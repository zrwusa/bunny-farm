// File: apps/api/src/auth/auth.resolver.ts
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { TokenOutput } from './dto/token.output';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlContext } from '../types/graphql';
import { CookieService } from '../core/cookie.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Mutation(() => TokenOutput)
  async login(
    @Args('input') input: LoginInput,
    @Context() { res }: GqlContext,
  ): Promise<TokenOutput> {
    const { type, email, password, oauthToken } = input;
    let user = null;
    if (type === 'local') {
      if (!email || !password) throw new BadRequestException('Email and password required');
      user = await this.authService.validateUser(email, password);
      if (!user) throw new UnauthorizedException('Invalid credentials');
    } else if (type === 'google') {
      if (!oauthToken) throw new BadRequestException('OAuth token required');
      user = await this.authService.validateOAuthUser('google', oauthToken);
      if (!user) throw new UnauthorizedException('Invalid OAuth credentials');
    } else {
      throw new BadRequestException('Unsupported login type');
    }

    const tokens = await this.authService.generateTokens(user);
    this.cookieService.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.accessTokenMeta,
      tokens.refreshTokenMeta,
    );
    return tokens;
  }

  @Mutation(() => TokenOutput)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
    @Context() { res }: GqlContext,
  ): Promise<TokenOutput> {
    const tokens = await this.authService.refreshToken(refreshToken);
    if (!tokens) throw new UnauthorizedException('Invalid refresh token');
    this.cookieService.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.accessTokenMeta,
      tokens.refreshTokenMeta,
    );
    return tokens;
  }

  @Mutation(() => TokenOutput)
  async refreshTokenByCookie(@Context() { req, res }: GqlContext): Promise<TokenOutput> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('No refresh token in cookies');

    const tokens = await this.authService.refreshToken(refreshToken);
    if (!tokens) throw new UnauthorizedException('Invalid refresh token');
    this.cookieService.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.accessTokenMeta,
      tokens.refreshTokenMeta,
    );
    return tokens;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(
    @CurrentUser('userId') userId: string,
    @Context() { res }: GqlContext,
  ): Promise<boolean> {
    await this.authService.logout(userId);
    this.cookieService.clearAuthCookies(res);
    return true;
  }
}
