import { Query, Resolver } from '@nestjs/graphql';
import { App } from './app.type';

@Resolver(() => App)
export class AppResolver {
  constructor() {}

  @Query(() => App, { name: 'ping' })
  ping() {
    return { message: 'Hello World' };
  }
}
