import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  AddViewReturns,
  GetPostReturns,
  AddLikeReturns,
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
  async Posts(@Args() paginationArgs: PaginationArgs) {
    const { searchString, page, take } = paginationArgs;
    let postsSearchString = searchString ?? '';
    const result = await this.appService.getAllPosts(
      postsSearchString,
      page,
      take,
    );
    return await result.toPromise();
  }

  @Query(() => GetPostReturns)
  async Post(@Args() IdArgs: IdArgs, @Context() context: { req: Request }) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const { id } = IdArgs;
    const result = await this.appService.getPost({ id, refreshToken });
    return await result.toPromise();
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
    const newFileName: string = Date.now() + '-' + filename;
    const filePath = join(process.cwd(), 'uploads/post', newFileName);
    await new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject),
    );
    const postUrl = `/uploads/post/${newFileName}`;
    const result = await this.appService.addPost({
      imageUrl: postUrl,
      ...addPostArgs,
      refreshToken,
    });
    return await result.toPromise();
  }

  @Mutation(() => AddViewReturns)
  async AddView(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.addView({ id, refreshToken });
    return await result.toPromise();
  }

  @Mutation(() => AddLikeReturns)
  async AddLike(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.addLike({ id, refreshToken });
    return await result.toPromise();
  }

  @Mutation(() => AddLikeReturns)
  async AddDislike(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.addLike({ id, refreshToken });
    return await result.toPromise();
  }
}
