import { Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => String, { name: 'pingElasticsearch' })
  async pingElasticsearch(): Promise<string> {
    const isAlive = await this.searchService.ping();
    return isAlive ? 'Elasticsearch is alive' : 'Elasticsearch is unreachable';
  }
}
