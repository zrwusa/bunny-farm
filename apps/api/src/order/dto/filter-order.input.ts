import { Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from '../../common/dto/pagination-input';

@InputType()
export class FilterOrderInput extends PaginationInput {
  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;
}
