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
  arrayOfPosts: Post[] = [
    { id: 'aaaaa', title: 's', body: 'a' },
    { id: 'bbbbb', title: 'what', body: 'hello' },
    { id: 'ccccc', title: 'what&', body: 'hi' },
  ];
  createPost(request: PostDto): Posts | Promise<Posts> | Observable<Posts> {
    this.arrayOfPosts.push(request);
    return { posts: this.arrayOfPosts };
  }
}
