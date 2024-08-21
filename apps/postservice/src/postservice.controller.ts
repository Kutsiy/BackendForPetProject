import {
  Post,
  PostDto,
  PostServiceController,
  PostServiceControllerMethods,
} from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

@Controller()
@PostServiceControllerMethods()
export class PostserviceController implements PostServiceController {
  createPost(request: PostDto): Post {
    return { id: 'a', title: 's', body: 'a' };
  }
}
