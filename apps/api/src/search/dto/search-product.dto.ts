import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@ObjectType()
export class SuggestDto {
  @IsArray()
  @IsString({ each: true })
  input: string[];

  @IsOptional()
  @IsNumber()
  weight?: number;
}

@ObjectType()
export class SearchProductDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @IsObject()
  description?: object;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  brand: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variants?: string[];

  @Field(() => SuggestDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  suggest?: SuggestDto;
}
