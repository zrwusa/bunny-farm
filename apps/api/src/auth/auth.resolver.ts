import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { TokenOutput } from './dto/token.output';
import { UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => TokenOutput)
  @Mutation(() => TokenOutput)
  async login(@Args('input') input: LoginInput): Promise<TokenOutput> {
    const { type, email, password, oauthToken } = input;

    if (type === 'local') {
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }
      // After calling Service, no longer catch 401, the Service returns null and then handles it uniformly
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.authService.generateTokens(user);
    } else if (type === 'google') {
      if (!oauthToken) {
        throw new BadRequestException('OAuth token is required');
      }
      const user = await this.authService.validateOAuthUser('google', oauthToken);
      if (!user) {
        throw new UnauthorizedException('Invalid OAuth credentials');
      }
      return this.authService.generateTokens(user);
    } else {
      throw new BadRequestException('Unsupported login type');
    }
  }

  @Mutation(() => TokenOutput)
  async refreshToken(
    @Args('userId') userId: string,
    @Args('refreshToken') refreshToken: string,
  ): Promise<TokenOutput> {
    const tokens = await this.authService.refreshToken(userId, refreshToken);
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return tokens;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser('userId') userId: string): Promise<boolean> {
    await this.authService.logout(userId);
    return true;
  }
}
