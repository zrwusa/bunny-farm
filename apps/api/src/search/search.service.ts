import { BadRequestException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchProductDto } from './dto/search-product.dto';
import {
  BulkResponse,
  WriteResponseBase,
  UpdateResponse,
  SearchHit,
  SearchCompletionSuggestOption,
} from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createProduct(product: SearchProductDto): Promise<WriteResponseBase> {
    const { id } = product;
    return this.elasticsearchService.create({
      index: 'products',
      id,
      document: product,
    });
  }

  async updateProduct(product: SearchProductDto): Promise<UpdateResponse> {
    return this.elasticsearchService.update({
      index: 'products',
      id: product.id,
      doc: product, // Update only changed fields
    });
  }

  async deleteProduct(id: string): Promise<WriteResponseBase> {
    return this.elasticsearchService.delete({
      index: 'products',
      id,
    });
  }

  async searchProducts(query: string): Promise<SearchHit<SearchProductDto>[]> {
    console.log('SearchService.searchProducts called with query:', query);

    const isEmptyQuery = !query?.trim();
    console.log('Is empty query:', isEmptyQuery);

    const searchQuery = isEmptyQuery
      ? { match_all: {} } // If query is empty, match all
      : {
          multi_match: {
            query,
            fields: [
              'name^3',
              'description.overview.model^3',
              'description.overview.description^2',
              'category',
              'brand',
            ],
            operator: 'and' as const, // All words must match
          },
        };

    console.log('Elasticsearch query:', JSON.stringify(searchQuery, null, 2));

    try {
      const response = await this.elasticsearchService.search<SearchProductDto>({
        index: 'products',
        size: 20, // Restrictions to return up to 20 records
        query: searchQuery,
        sort: isEmptyQuery
          ? [{ id: { order: 'desc' } }] // When empty strings are created in reverse order (assuming you have this field)
          : undefined,
      });

      console.log('Elasticsearch response:', JSON.stringify(response, null, 2));
      return response.hits?.hits || [];
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw error;
    }
  }

  async bulkIndexProducts(products: SearchProductDto[]): Promise<BulkResponse> {
    const index = 'products';

    const exists = await this.elasticsearchService.indices.exists({ index });

    if (exists) {
      await this.elasticsearchService.indices.delete({ index });
      console.log(`Deleted index: ${index}`);
    }

    await this.elasticsearchService.indices.create({
      index,
      mappings: {
        properties: {
          id: { type: 'keyword' },
          name: { type: 'text' },
          category: { type: 'keyword' },
          brand: { type: 'keyword' },
          variants: { type: 'keyword' },
          description: {
            type: 'object',
            properties: {
              overview: {
                type: 'object',
                properties: {
                  model: { type: 'text' },
                  description: { type: 'text' },
                },
              },
            },
          },
          suggest: {
            type: 'completion',
          },
        },
      },
    });

    console.log(`Created index '${index}' with custom mappings`);

    if (!products || products.length === 0) {
      throw new BadRequestException('Products array cannot be empty.');
    }

    const operations = products.flatMap((product) => [
      { index: { _index: 'products', _id: product.id } },
      product,
    ]);

    return this.elasticsearchService.bulk({ operations });
  }

  async suggestProducts(input: string): Promise<SearchHit<SearchProductDto>[]> {
    const isShort = input.trim().split(/\s+/).length <= 2;

    if (isShort) {
      const result = await this.elasticsearchService.search<SearchProductDto>({
        index: 'products',
        suggest: {
          product_suggest: {
            prefix: input,
            completion: {
              field: 'suggest',
              fuzzy: {
                fuzziness: 2,
                min_length: 3,
                prefix_length: 1,
                transpositions: true,
              },
              size: 10,
            },
          },
        },
      });

      // Convert suggestions to SearchHit format
      const suggestions = result.suggest?.product_suggest?.[0]?.options ?? [];
      return (Array.isArray(suggestions) ? suggestions : [suggestions]).map((suggestion) => {
        const completionOption = suggestion as SearchCompletionSuggestOption<SearchProductDto>;
        return {
          _index: 'products',
          _id: completionOption._id || '',
          _score: 0,
          _source: completionOption._source || ({} as SearchProductDto),
        };
      });
    } else {
      const result = await this.elasticsearchService.search<SearchProductDto>({
        index: 'products',
        size: 10,
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  name: {
                    query: input,
                    boost: 3,
                  },
                },
              },
              {
                match_phrase: {
                  name: {
                    query: input,
                    boost: 2,
                  },
                },
              },
              {
                multi_match: {
                  query: input,
                  fields: ['name^3', 'description.overview.description^2', 'brand', 'category'],
                  type: 'best_fields',
                },
              },
            ],
          },
        },
        _source: ['name'],
      });

      return result.hits?.hits || [];
    }
  }
}
