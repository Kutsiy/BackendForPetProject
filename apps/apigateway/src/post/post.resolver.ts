import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { Posts } from '@app/common';
import { Posts as PostsModel } from './post.model';

@Resolver()
export class PostResolver {
  constructor(@Inject(AppService) private appService: AppService) {}
  @Query(() => PostsModel)
  Posts(): Observable<Posts> {
    return this.appService.createPost();
  }
}
