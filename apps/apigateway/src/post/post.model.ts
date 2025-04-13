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

  @Field(() => String, { nullable: true })
  category: string;

  @Field(() => String, { nullable: true })
  sortFilter: string;
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

  @Field(() => [String], { nullable: true })
  comments: string[];

  @Field(() => Number)
  commentCount: number;

  @Field()
  createdAt: number;
}

@ObjectType()
export class UserCommentInfo {
  @Field(() => String)
  name: string;

  @Field(() => String)
  avatarLink: string;

  @Field(() => String)
  id: string;
}

@ObjectType()
export class Comment {
  @Field(() => String)
  postIdString: string;

  @Field(() => String)
  idString: string;

  @Field(() => UserCommentInfo)
  authorId: UserCommentInfo;

  @Field(() => String)
  postId: string;

  @Field(() => String)
  text: string;

  @Field(() => Number)
  createdAt: number;
}

@ObjectType()
export class AddViewReturns {
  @Field(() => String)
  result: string;

  @Field(() => Boolean)
  userExists: boolean;

  @Field(() => Int)
  currentViewsCount: number;
}

@ObjectType()
export class Rate {
  @Field(() => Boolean)
  userSetLike: boolean;

  @Field(() => Boolean)
  userSetDislike: boolean;
}

@ObjectType()
export class GetPostReturns {
  @Field(() => Post)
  post: Post;

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @Field(() => Rate)
  rate: Rate;
}

@ObjectType()
export class AddRateReturns {
  @Field(() => String)
  result: string;

  @Field(() => Int)
  currentLikeCount: number;

  @Field(() => Int)
  currentDislikeCount: number;

  @Field(() => Boolean)
  userSetLike: boolean;

  @Field(() => Boolean)
  userSetDislike: boolean;
}

@ArgsType()
export class AddCommentArgs {
  @Field(() => String)
  text: string;

  @Field(() => String)
  id: string;
}

@ObjectType()
export class AddCommentReturn {
  @Field(() => [Comment])
  comments: Comment[];
}

@ObjectType()
export class GetPostByUserReturns {
  @Field(() => [Post], { nullable: true })
  posts: Post[];
}

@ObjectType()
export class FindCommentByUserAndDelete {
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];
}

@ObjectType()
export class GetPopularPostReturns {
  @Field(() => [Post], { nullable: true })
  posts: Post[];
}
