import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserPreferenceInput {
  @Field()
  userId: string;

  @Field({ nullable: true, defaultValue: false })
  receiveNotifications: boolean;

  @Field({ nullable: true, defaultValue: false })
  receiveEmails: boolean;
}
