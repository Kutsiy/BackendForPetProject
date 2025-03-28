import {
  CreatePostArgs,
  POST_SERVICE_NAME,
  PostServiceClient,
} from '@app/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from '@app/common/types/protos/auth';
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
  getAllPosts(searchString: string, page, take) {
    return this.postService.getAllPosts({ searchString, page, take });
  }

  getPost(args: { id: string }) {
    return this.postService.getPost(args);
  }

  async addPost(args: CreatePostArgs) {
    return await this.postService.createPost(args);
  }
}
