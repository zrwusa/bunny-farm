// src/dictionary/dictionary.resolver.ts

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Word } from './entities/word.entity';
import { DictionaryService } from './dictionary.service';
import { PublishWordInput } from './dto/create-word.input';

@Resolver(() => Word)
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Word)
  async publishWord(@Args('input') input: PublishWordInput): Promise<Word | null> {
    return this.dictionaryService.createWord(input);
  }

  @Query(() => Word, { nullable: true })
  async findWord(@Args('text') text: string): Promise<Word | null> {
    return this.dictionaryService.findWordByText(text);
  }
}
