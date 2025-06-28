import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ElasticsearchModuleOptions => {
        const node = configService.get<string>('ELASTICSEARCH_NODE', 'https://localhost:9200');
        const isLocalhost = node.includes('localhost');
        const elasticVersion = configService.get<string>('ELASTIC_VERSION', '8.x');
        const isV7 = elasticVersion.startsWith('7');

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
          ...(isV7 && {
            apiVersion: '7.10',
            productCheck: false,
          }),
        };
      },
    }),
  ],
  exports: [ElasticsearchModule],
  providers: [SearchResolver, SearchService],
})
export class SearchModule {}
