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
}

@ObjectType()
export class AddPostReturn {
  @Field(() => String)
  result: string;
}

// @ObjectType()
// export class Post {
//   @Field(() => String)
//   id: string;

//   @Field(() => String)
//   imageUrl: string;

//   @Field(() => String)
//   title: string;

//   @Field(() => String)
//   body: string;

//   @Field(() => String)
//   authorId: string;

//   @Field(() => String)
//   category: string;

//   @Field(() => Number)
//   views: number;

//   @Field(() => Number)
//   likes: number;

//   @Field(() => Number)
//   dislikes: number;

//   @Field(() => [String])
//   likedBy: string[];

//   @Field(() => [String])
//   dislikedBy: string[];

//   @Field(() => [Comment])
//   comments: Comment[];

//   @Field()
//   createdAt: Date;
// }

// @ObjectType()
// export class Comment {
//   @Field(() => String)
//   userId: string;

//   @Field(() => String)
//   text: string;

//   @Field(() => Date)
//   createdAt: Date;
// }
