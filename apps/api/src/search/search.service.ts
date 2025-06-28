import { Injectable, BadRequestException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { SearchProductDto } from './dto/search-product.dto';
import { ElasticCompat } from './elasticsearch-version.helper';
import { SearchResponse } from '@elastic/elasticsearch/api/types';

@Injectable()
export class SearchService {
  private readonly compat: ElasticCompat;

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {
    this.compat = new ElasticCompat(this.configService);
  }

  async createProduct(product: SearchProductDto) {
    const { id } = product;
    return this.elasticsearchService.create(this.compat.createParams('products', id, product));
  }

  async updateProduct(product: SearchProductDto) {
    return this.elasticsearchService.update(
      this.compat.updateParams('products', product.id, product),
    );
  }

  async deleteProduct(id: string) {
    return this.elasticsearchService.delete({ index: 'products', id });
  }

  async ping() {
    return this.elasticsearchService.ping();
  }

  async searchProducts(query: string) {
    const isEmptyQuery = !query?.trim();

    const queryBody = isEmptyQuery
      ? { query: { match_all: {} }, sort: [{ id: { order: 'desc' } }] }
      : {
          query: {
            multi_match: {
              query,
              fields: [
                'name^3',
                'description.overview.model^3',
                'description.overview.description^2',
                'category',
                'brand',
              ],
              operator: 'and',
            },
          },
        };

    const result = await this.elasticsearchService.search<SearchResponse<SearchProductDto>>(
      this.compat.searchParams('products', { size: 100, ...queryBody }),
    );

    return this.compat.extractHits(result);
  }

  async bulkIndexProducts(products: SearchProductDto[]) {
    const index = 'products';

    const existsRaw = await this.elasticsearchService.indices.exists({ index });
    const exists = this.compat.extractExists(existsRaw);
    console.debug('---exists', exists);
    if (exists) {
      await this.elasticsearchService.indices.delete({ index });
    }

    await this.elasticsearchService.indices.create(
      this.compat.createIndexParams(index, {
        properties: {
          id: { type: 'keyword' },
          name: { type: 'text' },
          category: { type: 'keyword' },
          brand: { type: 'keyword' },
          skus: { type: 'keyword' },
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
          suggest: { type: 'completion' },
        },
      }),
    );

    if (!products?.length) {
      throw new BadRequestException('Products array cannot be empty.');
    }

    const ops = products.flatMap((p) => [{ index: { _index: index, _id: p.id } }, p]);

    return this.elasticsearchService.bulk(this.compat.bulkParams(ops));
  }

  async suggestProducts(input: string) {
    const isShort = input.trim().split(/\s+/).length <= 2;

    if (isShort) {
      const result = await this.elasticsearchService.search<SearchResponse<SearchProductDto>>(
        this.compat.searchParams('products', {
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
        }),
      );

      const suggestions = this.compat.extractSuggest(result)?.product_suggest?.[0]?.options ?? [];

      return (Array.isArray(suggestions) ? suggestions : [suggestions]).map((s) => {
        const result: Record<string, any> = {
          _index: 'products',
          _score: 0,
        };

        const sAny = s as any;
        if (sAny._id) {
          result._id = sAny._id;
        }

        if (sAny._source) {
          result._source = sAny._source;
        }

        return result;
      });
    }

    const result = await this.elasticsearchService.search<SearchResponse<SearchProductDto>>(
      this.compat.searchParams('products', {
        size: 10,
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  name: { query: input, boost: 3 },
                },
              },
              {
                match_phrase: {
                  name: { query: input, boost: 2 },
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
      }),
    );

    return this.compat.extractHits(result);
  }
}
