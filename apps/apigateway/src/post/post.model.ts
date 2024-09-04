import { ObjectType, Field, Int, ArgsType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  body: string;
}

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  pageCount: number;

  @Field(() => Int)
  currentPage: number;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  page: number = 1;

  @Field(() => Int)
  take: number = 10;
}
