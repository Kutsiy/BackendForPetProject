import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { PaginatedPosts } from '@app/common';
import { PaginatedPosts as PostsModel, Post } from './post.model';

@Resolver(() => Post)
export class PostResolver {
  constructor(@Inject(AppService) private appService: AppService) {}

  @Query(() => PostsModel)
  Posts(): Observable<PaginatedPosts> {
    return this.appService.getAllPosts();
  }
}
