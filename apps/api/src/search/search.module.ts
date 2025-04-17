import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'https://localhost:9200',
      auth: {
        username: 'elastic',
        password: 'dev_password',
      },
      tls: {
        ca: readFileSync(join(__dirname, '..', '..', 'certs', 'ca.crt')), // Read certs/ca.crt in the root directory of the project
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    }),
  ],
  exports: [ElasticsearchModule],
  providers: [SearchResolver, SearchService],
})
export class SearchModule {}
