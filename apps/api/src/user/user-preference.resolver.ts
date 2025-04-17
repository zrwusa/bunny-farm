import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserPreferenceService } from './user-preference.service';
import { UserPreference } from './entities/user-preference.entity';
import { CreateUserPreferenceInput } from './dto/create-user-preference.input';

@Resolver()
export class UserPreferenceResolver {
  constructor(private userSettingsService: UserPreferenceService) {}

  @Mutation(() => UserPreference)
  async createUserSettings(
    @Args('createUserPreferenceInput')
    createUserPreferenceInput: CreateUserPreferenceInput,
  ) {
    return await this.userSettingsService.create(createUserPreferenceInput);
  }
}
