import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  body: string;
}
