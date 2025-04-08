import { ObjectType, Field, Int, ArgsType } from '@nestjs/graphql';

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
  description: string;
}

@ObjectType()
export class AddPostReturn {
  @Field(() => String)
  result: string;
}

@ObjectType()
export class Post {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  body: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  authorName: string;

  @Field(() => String)
  category: string;

  @Field(() => Number)
  views: number;

  @Field(() => [String], { nullable: true })
  viewsBy: string[];

  @Field(() => Number)
  likes: number;

  @Field(() => Number)
  dislikes: number;

  @Field(() => [String], { nullable: true })
  likedBy: string[];

  @Field(() => [String], { nullable: true })
  dislikedBy: string[];

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @Field(() => Number)
  commentCount: number;

  @Field()
  createdAt: number;
}

@ObjectType()
export class Comment {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  text: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class AddViewReturns {
  @Field(() => String)
  result: string;

  @Field(() => Boolean)
  userExists: boolean;
}
