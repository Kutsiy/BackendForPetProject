import { POST_SERVICE_NAME, PostServiceClient } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {
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
}
