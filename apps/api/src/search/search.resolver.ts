import { Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  // @Query(() => [SearchProductDto], { name: 'searchProducts' })
  // async searchProducts(@Args('keyword', { type: () => String }) keyword: string) {
  //   return this.searchService.searchProducts(keyword);
  // }
}
