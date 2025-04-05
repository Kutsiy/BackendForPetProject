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

export interface Comment {
  userId: string;
  text: string;
  createdAt: number;
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
  comments: Comment[];
  createdAt: number;
}

export const POST_PACKAGE_NAME = "post";

export interface PostServiceClient {
  getAllPosts(request: PaginationArgs): Observable<PaginatedPosts>;

  getPost(request: FindPostById): Observable<Post>;

  createPost(request: CreatePostArgs): Observable<CreatePostReturns>;
}

export interface PostServiceController {
  getAllPosts(request: PaginationArgs): Promise<PaginatedPosts> | Observable<PaginatedPosts> | PaginatedPosts;

  getPost(request: FindPostById): Promise<Post> | Observable<Post> | Post;

  createPost(request: CreatePostArgs): Promise<CreatePostReturns> | Observable<CreatePostReturns> | CreatePostReturns;
}

export function PostServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAllPosts", "getPost", "createPost"];
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
