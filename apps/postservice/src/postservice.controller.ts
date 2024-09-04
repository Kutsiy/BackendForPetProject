import {
  Post,
  PaginatedPosts,
  PostServiceController,
  PostServiceControllerMethods,
} from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

@Controller()
@PostServiceControllerMethods()
export class PostserviceController implements PostServiceController {
  arrayOfPosts: Post[] = Array(100).fill({
    id: `${Math.floor(Math.random() * 9999)}`,
    title: 'Hello',
    body: 'Hello',
  });
  getAllPosts(): PaginatedPosts {
    return { posts: this.arrayOfPosts };
  }
}
