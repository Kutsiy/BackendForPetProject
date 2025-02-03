import { Inject, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import { PaginatedPosts } from '@app/common';
import {
  PaginatedPosts as PostsModel,
  Post,
  PaginationArgs,
  IdArgs,
} from './post.model';
import { AuthGuard } from '../tools/guards/auth/auth.guard';

@Resolver(() => Post)
@UseGuards(AuthGuard)
export class PostResolver {
  constructor(@Inject(PostService) private appService: PostService) {}

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
