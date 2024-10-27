import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { PaginatedPosts } from '@app/common';
import {
  PaginatedPosts as PostsModel,
  Post,
  PaginationArgs,
  IdArgs,
} from './post.model';

@Resolver(() => Post)
export class PostResolver {
  constructor(@Inject(AppService) private appService: AppService) {}

  @Query(() => PostsModel)
  Posts(@Args() paginationArgs: PaginationArgs): Observable<PaginatedPosts> {
    const { searchString, page, take } = paginationArgs;
    let postsSearchString = searchString ?? '';
    return this.appService.getAllPosts(postsSearchString, page, take);
  }

  @Query(() => Post)
  Post(@Args() IdArgs: IdArgs) {
    return this.appService.getPost(IdArgs);
  }
}
