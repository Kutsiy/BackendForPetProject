import {
  AddCommentArgs,
  AddViewArgs,
  CreatePostArgs,
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
  async getAllPosts(searchString: string, page, take) {
    return await this.postService.getAllPosts({ searchString, page, take });
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
}
