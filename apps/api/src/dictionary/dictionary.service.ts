import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { WordVariant } from './entities/word-variant.entity';
import { VariantAttribute } from './entities/variant-attribute.entity';
import { ExampleSentence } from './entities/example-sentence.entity';
import { Morpheme } from './entities/word-morpheme.entity';
import { PublishWordInput } from './dto/create-word.input';
import { VariantSynonym } from './entities/variant-synonym.entity';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,

    @InjectRepository(WordVariant)
    private readonly variantRepo: Repository<WordVariant>,

    @InjectRepository(VariantAttribute)
    private readonly attrRepo: Repository<VariantAttribute>,

    @InjectRepository(ExampleSentence)
    private readonly exampleRepo: Repository<ExampleSentence>,

    @InjectRepository(VariantSynonym)
    private readonly synonymRepo: Repository<VariantSynonym>,

    @InjectRepository(Morpheme)
    private readonly morphemeRepo: Repository<Morpheme>,
  ) {}

  async createWord(input: PublishWordInput): Promise<Word | null> {
    const word = this.wordRepo.create(input);
    for (const variant of word.variants) {
      for (const synonym of variant.synonyms ?? []) {
        // Query whether there is a variant with the same text and partOfSpeech
        const existingVariant = await this.variantRepo.findOne({
          where: {
            word: { text: synonym.text },
            partOfSpeech: synonym.partOfSpeech ?? variant.partOfSpeech,
            // TODO PostgreSQL Full-Text Search (supports approximate semantics), In the future, pgvector vectors may be used to support more comprehensive semantic understanding
            definition: Raw(
              (alias) => `to_tsvector('english', ${alias}) @@ plainto_tsquery('english', :query)`,
              { query: synonym.definition ?? synonym.text },
            ),
          },
          relations: ['word'],
        });

        if (existingVariant) {
          synonym.synonymVariant = existingVariant;
        }
      }
    }

    for (const morpheme of word.morphemes) {
      for (const relatedWord of morpheme.relatedWords ?? []) {
        // Query whether there is a variant with the same text and partOfSpeech
        const existingVariant = await this.variantRepo.findOne({
          where: {
            word: { text: relatedWord.text },
            partOfSpeech: relatedWord.partOfSpeech,
            // TODO PostgreSQL Full-Text Search (supports approximate semantics), In the future, pgvector vectors may be used to support more comprehensive semantic understanding
            definition: Raw(
              (alias) => `to_tsvector('english', ${alias}) @@ plainto_tsquery('english', :query)`,
              { query: relatedWord.definition },
            ),
          },
          relations: ['word'],
        });

        if (existingVariant) {
          relatedWord.relatedWordVariant = existingVariant;
        }
      }
    }

    // Save Word, automatically save all associations
    const savedWord = await this.wordRepo.save(word);

    // Query and return the complete object
    return this.findWordByText(savedWord.text);
  }

  async findWordByText(text: string): Promise<Word | null> {
    return this.wordRepo.findOne({
      where: { text },
      relations: [
        'variants',
        'variants.attributes',
        'variants.examples',
        'variants.synonyms',
        'morphemes',
      ],
    });
  }
}
