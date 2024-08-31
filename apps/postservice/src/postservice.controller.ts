import {
  Post,
  PostDto,
  Posts,
  PostServiceController,
  PostServiceControllerMethods,
} from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

@Controller()
@PostServiceControllerMethods()
export class PostserviceController implements PostServiceController {
  arrayOfPosts: Post[] = [{ id: 'aaaaa', title: 's', body: 'a' }];
  createPost(request: PostDto): Posts | Promise<Posts> | Observable<Posts> {
    this.arrayOfPosts.push(request);
    return { posts: this.arrayOfPosts };
  }
}
