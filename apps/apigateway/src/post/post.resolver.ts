import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import { PaginatedPosts } from '@app/common';
import {
  PaginatedPosts as PostsModel,
  Post,
  PaginationArgs,
  IdArgs,
  AddPostArgs,
  AddPostReturn,
} from './post.model';
import { AuthGuard } from '../tools/guards/auth/auth.guard';
import { RolesGuard } from '../tools/guards/roles/roles.guard';
import { RolesSetter } from '../tools/guards/roles/roles.guard-setter';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Request } from 'express';
import { join } from 'path';
import { createWriteStream } from 'fs';

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

  @Mutation(() => AddPostReturn)
  async AddPost(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
    @Args() addPostArgs: AddPostArgs,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const filePath = join(process.cwd(), 'uploads/post', filename);
    await new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject),
    );
    const postUrl = `/uploads/post/${filename}`;
    const result = await this.appService.addPost({
      imageUrl: postUrl,
      ...addPostArgs,
    });
    return await result.toPromise();
  }
}
