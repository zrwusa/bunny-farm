import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { name: 'user', nullable: true })
  getUserById(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => [User], { name: 'users' })
  getUsers() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser('userId') userId: string) {
    return this.userService.findById(userId);
  }
}
