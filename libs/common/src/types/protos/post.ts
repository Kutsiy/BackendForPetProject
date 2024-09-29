// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.2
//   protoc               v3.20.3
// source: protos/post.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "post";

export interface PostDto {
  id: string;
  title: string;
  body: string;
}

export interface Empty {
}

export interface Post {
  id: string;
  title: string;
  body: string;
}

export interface PaginatedPosts {
  posts: Post[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  searchString: string;
}

export interface PaginationArgs {
  searchString: string;
  page: number;
  take: number;
}

export const POST_PACKAGE_NAME = "post";

export interface PostServiceClient {
  getAllPosts(request: PaginationArgs): Observable<PaginatedPosts>;
}

export interface PostServiceController {
  getAllPosts(request: PaginationArgs): Promise<PaginatedPosts> | Observable<PaginatedPosts> | PaginatedPosts;
}

export function PostServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAllPosts"];
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
