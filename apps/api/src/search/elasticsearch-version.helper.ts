import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@elastic/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/api/types';

type ElasticVersion = '7.x' | '8.x';

export class ElasticCompat<V extends ElasticVersion = '7.x'> {
  private readonly isV7: boolean;

  constructor(private readonly configService: ConfigService) {
    const version = this.configService.get<string>('ELASTIC_VERSION', '7.x');
    this.isV7 = version.startsWith('7');
  }

  createParams(
    index: string,
    id: string,
    document: any,
  ): V extends '7.x'
    ? { index: string; id: string; body: any }
    : { index: string; id: string; document: any } {
    return (this.isV7 ? { index, id, body: document } : { index, id, document }) as any;
  }

  updateParams(
    index: string,
    id: string,
    doc: any,
  ): V extends '7.x'
    ? { index: string; id: string; body: { doc: any } }
    : { index: string; id: string; doc: any } {
    return (this.isV7 ? { index, id, body: { doc } } : { index, id, doc }) as any;
  }

  bulkParams(ops: any[]): V extends '7.x' ? { body: any[] } : { operations: any[] } {
    return (this.isV7 ? { body: ops } : { operations: ops }) as any;
  }

  searchParams(
    index: string,
    options: any,
  ): V extends '7.x' ? { index: string; body: any } : { index: string } & any {
    return (this.isV7 ? { index, body: options } : { index, ...options }) as any;
  }

  createIndexParams(index: string, mappings: any): { index: string; body: { mappings: any } } {
    return { index, body: { mappings } };
  }

  extractHits<T>(res: ApiResponse<SearchResponse<T>> | SearchResponse<T>) {
    const hits = 'body' in res ? (res.body as SearchResponse<T>).hits?.hits : res.hits?.hits;
    return hits?.map((h) => ({ _id: h._id, _source: h._source! })) ?? [];
  }

  extractSuggest<T extends object>(res: ApiResponse<T> | T): any {
    return 'body' in res ? (res.body as any).suggest : (res as any).suggest;
  }

  /** Unified processing exists Return */
  extractExists(result: any): boolean {
    // 8.x returns { body: boolean }, 7.x is boolean
    if (typeof result === 'boolean') {
      return result;
    }
    if (result && typeof result.body === 'boolean') {
      return result.body;
    }
    throw new Error('Invalid response format from indices.exists');
  }
}
