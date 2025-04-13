import {
  AddCommentArgs,
  AddViewArgs,
  CreatePostArgs,
  FindCommentByUserAndDeleteArgs,
  FindPostByUserAndDeleteArgs,
  GetPostByUserArgs,
  POST_SERVICE_NAME,
  PostServiceClient,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class PostService implements OnModuleInit {
  private postService: PostServiceClient;
  constructor(@Inject('POST_SERVICE') private client: ClientGrpc) {}
  onModuleInit() {
    this.postService =
      this.client.getService<PostServiceClient>(POST_SERVICE_NAME);
  }
  async getAllPosts(searchString: string, page, take, category, sortFilter) {
    return await this.postService.getAllPosts({
      searchString,
      page,
      take,
      category,
      sortFilter,
    });
  }

  async getPost(args: { id: string; refreshToken: string }) {
    return await this.postService.getPost(args);
  }

  async addPost(args: CreatePostArgs) {
    return await this.postService.createPost(args);
  }

  async addView(args: AddViewArgs) {
    return await this.postService.addView(args);
  }

  async addLike(args: AddViewArgs) {
    return await this.postService.addLike(args);
  }

  async addDislike(args: AddViewArgs) {
    return await this.postService.addDislike(args);
  }

  async addComment(args: AddCommentArgs) {
    return await this.postService.addComment(args);
  }

  async getPostByUser(args: GetPostByUserArgs) {
    return await this.postService.getPostByUser(args);
  }

  async findPostByUserAndDelete(args: FindPostByUserAndDeleteArgs) {
    return await this.postService.findPostByUserAndDelete(args);
  }

  async findCommentByUserAndDelete(args: FindCommentByUserAndDeleteArgs) {
    return await this.postService.findCommentByUserAndDelete(args);
  }

  async getPopularPost() {
    return await this.postService.getPopularPost({});
  }
}
