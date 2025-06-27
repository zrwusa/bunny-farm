import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const node = configService.get<string>('ELASTICSEARCH_NODE', 'https://localhost:9200');
        const isLocalhost = node.includes('localhost');

        return {
          node,
          auth: {
            username: configService.get<string>('ELASTICSEARCH_USERNAME', 'elastic'),
            password: configService.get<string>('ELASTICSEARCH_PASSWORD', 'dev_password'),
          },
          ...(isLocalhost && {
            tls: {
              ca: readFileSync(join(__dirname, '..', '..', 'certs', 'ca.crt')),
              rejectUnauthorized: false,
            },
          }),
          // apiVersion: '7.10', // Compatible with Bonsai ES 7.10.2
          // productCheck: false, // Compatible with, disable product verification
        };
      },
    }),
  ],
  exports: [ElasticsearchModule],
  providers: [SearchResolver, SearchService],
})
export class SearchModule {}
