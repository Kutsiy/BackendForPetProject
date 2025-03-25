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
import { RolesGuard } from '../tools/guards/roles/roles.guard';
import { RolesSetter } from '../tools/guards/roles/roles.guard-setter';

@Resolver(() => Post)
@UseGuards(AuthGuard, RolesGuard)
export class PostResolver {
  constructor(@Inject(PostService) private appService: PostService) {}

  @Query(() => PostsModel)
  @RolesSetter(['USER'])
  Posts(@Args() paginationArgs: PaginationArgs): Observable<PaginatedPosts> {
    const { searchString, page, take } = paginationArgs;
    let postsSearchString = searchString ?? '';
    return this.appService.getAllPosts(postsSearchString, page, take);
  }

  @Query(() => Post)
  Post(@Args() IdArgs: IdArgs) {
    return this.appService.getPost(IdArgs);
  }

  AddPost() {}
}
