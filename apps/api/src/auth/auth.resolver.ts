import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { TokenOutput } from './dto/token.output';
import { UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlContext } from '../types/graphql';
import { CookieService } from '../core/cookie.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Mutation(() => TokenOutput)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: GqlContext,
  ): Promise<TokenOutput> {
    const { type, email, password, oauthToken } = input;
    let user = null;
    if (type === 'local') {
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }
      // After calling Service, no longer catch 401, the Service returns null and then handles it uniformly
      user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else if (type === 'google') {
      if (!oauthToken) {
        throw new BadRequestException('OAuth token is required');
      }
      user = await this.authService.validateOAuthUser('google', oauthToken);
      if (!user) {
        throw new UnauthorizedException('Invalid OAuth credentials');
      }
    } else {
      throw new BadRequestException('Unsupported login type');
    }
    const tokens = await this.authService.generateTokens(user);
    this.cookieService.setAuthCookies(context.res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  @Mutation(() => TokenOutput)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
    @Context() context: GqlContext,
  ): Promise<TokenOutput> {
    const tokens = await this.authService.refreshToken(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    this.cookieService.setAuthCookies(context.res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  @Mutation(() => TokenOutput)
  async refreshTokenByCookie(@Context() context: GqlContext): Promise<TokenOutput> {
    const { req, res } = context;

    const refreshToken = req.cookies?.refreshToken ?? req.cookies?.refresh_token;
    console.debug('---req.cookies', req.cookies);

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found in cookies');
    }

    const tokens = await this.authService.refreshToken(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.cookieService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(
    @CurrentUser('userId') userId: string,
    @Context() context: GqlContext,
  ): Promise<boolean> {
    await this.authService.logout(userId);

    this.cookieService.clearAuthCookies(context.res);
    return true;
  }
}
