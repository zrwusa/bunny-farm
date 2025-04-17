import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { TokenOutput } from './dto/token.output';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => TokenOutput)
  async login(@Args('input') input: LoginInput): Promise<TokenOutput> {
    const { type } = input;

    let user;
    if (type === 'local') {
      const { email, password } = input;
      user = await this.authService.validateUser(email, password);
    } else if (type === 'google') {
      const { oauthToken } = input;
      user = await this.authService.validateOAuthUser('google', oauthToken);
    } else {
      throw new Error('Unsupported login type');
    }

    return this.authService.generateTokens(user);
  }

  @Mutation(() => TokenOutput)
  async refreshToken(
    @Args('userId') userId: string,
    @Args('refreshToken') refreshToken: string,
  ): Promise<TokenOutput> {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser('userId') userId: string): Promise<boolean> {
    await this.authService.logout(userId);
    return true;
  }
}
