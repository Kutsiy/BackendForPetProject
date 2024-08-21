import { Inject } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { Post } from '@app/common';
import { Post as PostModel } from './post.model';

@Resolver()
export class PostResolver {
  constructor(@Inject(AppService) private appService: AppService) {}
  @Query(() => PostModel)
  sayHello(): Observable<Post> {
    return this.appService.createPost();
  }
}
