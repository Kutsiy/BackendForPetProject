// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.2
//   protoc               v3.20.3
// source: protos/post.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "post";

export interface FindPostById {
  id: string;
  refreshToken: string;
}

export interface Rate {
  userSetLike: boolean;
  userSetDislike: boolean;
}

export interface GetPostReturns {
  post: Post | undefined;
  comments: Comment[];
  rate: Rate | undefined;
}

export interface Empty {
}

export interface PaginatedPosts {
  posts: Post[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  searchString: string;
  isEmpty: boolean;
}

export interface PaginationArgs {
  searchString: string;
  page: number;
  take: number;
  category: string;
  sortFilter: string;
}

export interface CreatePostArgs {
  imageUrl: string;
  title: string;
  description: string;
  body: string;
  category: string;
  refreshToken: string;
}

export interface CreatePostReturns {
  result: string;
}

export interface UserCommentInfo {
  name: string;
  avatarLink: string;
  id: string;
}

export interface Comment {
  postIdString: string;
  authorId: UserCommentInfo | undefined;
  postId: string;
  text: string;
  createdAt: number;
  idString: string;
}

export interface Post {
  id: string;
  imageUrl?: string | undefined;
  title: string;
  body: string;
  description: string;
  authorId: string;
  authorName: string;
  category: string;
  views: number;
  viewsBy: string[];
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  comments: string[];
  commentCount: number;
  createdAt: number;
}

export interface AddViewArgs {
  id: string;
  refreshToken: string;
}

export interface AddViewAReturns {
  result: string;
  userExists: boolean;
  currentViewsCount: number;
}

export interface AddLikeArgs {
  id: string;
  refreshToken: string;
}

export interface AddLikeReturns {
  result: string;
  currentLikeCount: number;
  currentDislikeCount: number;
  userSetLike: boolean;
  userSetDislike: boolean;
}

export interface AddDislikeArgs {
  id: string;
  refreshToken: string;
}

export interface AddDislikeReturns {
  result: string;
  currentLikeCount: number;
  currentDislikeCount: number;
  userSetLike: boolean;
  userSetDislike: boolean;
}

export interface AddCommentArgs {
  text: string;
  id: string;
  refreshToken: string;
}

export interface AddCommentReturn {
  comments: Comment[];
}

export interface GetPostByUserArgs {
  refreshToken: string;
}

export interface GetPostByUserReturn {
  posts: Post[];
}

export interface FindPostByUserAndDeleteArgs {
  refreshToken: string;
  id: string;
}

export interface FindPostByUserAndDeleteReturn {
  posts: Post[];
}

export interface FindCommentByUserAndDeleteArgs {
  refreshToken: string;
  id: string;
  commentId: string;
}

export interface FindCommentByUserAndDeleteReturn {
  comments: Comment[];
}

export interface GetPopularPostReturn {
  posts: Post[];
}

export const POST_PACKAGE_NAME = "post";

export interface PostServiceClient {
  getAllPosts(request: PaginationArgs): Observable<PaginatedPosts>;

  getPost(request: FindPostById): Observable<GetPostReturns>;

  createPost(request: CreatePostArgs): Observable<CreatePostReturns>;

  addView(request: AddViewArgs): Observable<AddViewAReturns>;

  addLike(request: AddLikeArgs): Observable<AddLikeReturns>;

  addDislike(request: AddDislikeArgs): Observable<AddDislikeReturns>;

  addComment(request: AddCommentArgs): Observable<AddCommentReturn>;

  getPostByUser(request: GetPostByUserArgs): Observable<GetPostByUserReturn>;

  getViewPostByUser(request: GetPostByUserArgs): Observable<GetPostByUserReturn>;

  getRatePostByUser(request: GetPostByUserArgs): Observable<GetPostByUserReturn>;

  findPostByUserAndDelete(request: FindPostByUserAndDeleteArgs): Observable<FindPostByUserAndDeleteReturn>;

  findCommentByUserAndDelete(request: FindCommentByUserAndDeleteArgs): Observable<FindCommentByUserAndDeleteReturn>;

  getPopularPost(request: Empty): Observable<GetPopularPostReturn>;
}

export interface PostServiceController {
  getAllPosts(request: PaginationArgs): Promise<PaginatedPosts> | Observable<PaginatedPosts> | PaginatedPosts;

  getPost(request: FindPostById): Promise<GetPostReturns> | Observable<GetPostReturns> | GetPostReturns;

  createPost(request: CreatePostArgs): Promise<CreatePostReturns> | Observable<CreatePostReturns> | CreatePostReturns;

  addView(request: AddViewArgs): Promise<AddViewAReturns> | Observable<AddViewAReturns> | AddViewAReturns;

  addLike(request: AddLikeArgs): Promise<AddLikeReturns> | Observable<AddLikeReturns> | AddLikeReturns;

  addDislike(request: AddDislikeArgs): Promise<AddDislikeReturns> | Observable<AddDislikeReturns> | AddDislikeReturns;

  addComment(request: AddCommentArgs): Promise<AddCommentReturn> | Observable<AddCommentReturn> | AddCommentReturn;

  getPostByUser(
    request: GetPostByUserArgs,
  ): Promise<GetPostByUserReturn> | Observable<GetPostByUserReturn> | GetPostByUserReturn;

  getViewPostByUser(
    request: GetPostByUserArgs,
  ): Promise<GetPostByUserReturn> | Observable<GetPostByUserReturn> | GetPostByUserReturn;

  getRatePostByUser(
    request: GetPostByUserArgs,
  ): Promise<GetPostByUserReturn> | Observable<GetPostByUserReturn> | GetPostByUserReturn;

  findPostByUserAndDelete(
    request: FindPostByUserAndDeleteArgs,
  ): Promise<FindPostByUserAndDeleteReturn> | Observable<FindPostByUserAndDeleteReturn> | FindPostByUserAndDeleteReturn;

  findCommentByUserAndDelete(
    request: FindCommentByUserAndDeleteArgs,
  ):
    | Promise<FindCommentByUserAndDeleteReturn>
    | Observable<FindCommentByUserAndDeleteReturn>
    | FindCommentByUserAndDeleteReturn;

  getPopularPost(
    request: Empty,
  ): Promise<GetPopularPostReturn> | Observable<GetPopularPostReturn> | GetPopularPostReturn;
}

export function PostServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAllPosts",
      "getPost",
      "createPost",
      "addView",
      "addLike",
      "addDislike",
      "addComment",
      "getPostByUser",
      "getViewPostByUser",
      "getRatePostByUser",
      "findPostByUserAndDelete",
      "findCommentByUserAndDelete",
      "getPopularPost",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PostService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PostService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const POST_SERVICE_NAME = "PostService";
