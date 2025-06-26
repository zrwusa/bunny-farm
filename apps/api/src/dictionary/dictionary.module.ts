import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { DictionaryResolver } from './dictionary.resolver';
import { DictionaryService } from './dictionary.service';
import { ExampleSentence } from './entities/example-sentence.entity';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { VariantSynonym } from './entities/variant-synonym.entity';
import { Morpheme } from './entities/word-morpheme.entity';
import { WordVariant } from './entities/word-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Word,
      ExampleSentence,
      VariantAttribute,
      VariantSynonym,
      Morpheme,
      WordVariant,
    ]),
  ],
  providers: [DictionaryResolver, DictionaryService],
})
export class DictionaryModule {}
