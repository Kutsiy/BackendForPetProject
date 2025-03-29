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

  @Field(() => Boolean)
  isEmpty: boolean;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => String, { nullable: true })
  searchString: string;

  @Field(() => Int)
  page: number = 1;

  @Field(() => Int)
  take: number = 10;
}

@ArgsType()
export class IdArgs {
  @Field(() => String, { nullable: true })
  id: string;
}

@ArgsType()
export class AddPostArgs {
  @Field(() => String)
  title: string;

  @Field(() => String)
  body: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  authorId: string;
}

@ObjectType()
export class AddPostReturn {
  @Field(() => String)
  result: string;
}
