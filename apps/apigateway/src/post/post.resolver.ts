import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import {
  PaginatedPosts as PostsModel,
  Post,
  PaginationArgs,
  IdArgs,
  AddPostArgs,
  AddPostReturn,
  AddViewReturns,
  GetPostReturns,
  AddRateReturns,
  AddCommentArgs,
  AddCommentReturn,
  GetPostByUserReturns,
  FindCommentByUserAndDelete,
  GetPopularPostReturns,
} from './post.model';
import { AuthGuard } from '../tools/guards/auth/auth.guard';
import { RolesGuard } from '../tools/guards/roles/roles.guard';
import { RolesSetter } from '../tools/guards/roles/roles.guard-setter';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Request } from 'express';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Resolver(() => Post)
export class PostResolver {
  constructor(@Inject(PostService) private appService: PostService) {}

  @Query(() => PostsModel)
  async Posts(@Args() paginationArgs: PaginationArgs) {
    const { searchString, page, take, category, sortFilter } = paginationArgs;
    let postsSearchString = searchString ?? '';
    const result = await this.appService.getAllPosts(
      postsSearchString,
      page,
      take,
      category,
      sortFilter,
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
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
  async AddView(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.addView({ id, refreshToken });
    return await result.toPromise();
  }

  @Mutation(() => AddRateReturns)
  @UseGuards(AuthGuard, RolesGuard)
  async AddLike(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.addLike({ id, refreshToken });
    return await result.toPromise();
  }

  @Mutation(() => AddRateReturns)
  @UseGuards(AuthGuard, RolesGuard)
  async AddDislike(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.addDislike({ id, refreshToken });
    return await result.toPromise();
  }

  @Mutation(() => AddCommentReturn)
  @UseGuards(AuthGuard, RolesGuard)
  async AddComment(
    @Args() commentArgs: AddCommentArgs,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.addComment({
      ...commentArgs,
      refreshToken,
    });
    return await result.toPromise();
  }

  @Query(() => GetPostByUserReturns)
  @UseGuards(AuthGuard, RolesGuard)
  async PostByUser(@Context() context: { req: Request }) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.getPostByUser({ refreshToken });
    return await result.toPromise();
  }

  @Mutation(() => GetPostByUserReturns)
  @UseGuards(AuthGuard, RolesGuard)
  async FindPostByUserAndDelete(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.findPostByUserAndDelete({
      id,
      refreshToken,
    });
    return await result.toPromise();
  }

  @Mutation(() => FindCommentByUserAndDelete)
  @UseGuards(AuthGuard, RolesGuard)
  async FindCommentByUserAndDelete(
    @Args('id', { type: () => String }) id: string,
    @Args('commentId', { type: () => String }) commentId: string,
    @Context() context: { req: Request },
  ) {
    const { req } = context;
    const refreshToken = req.cookies?.refresh_token;
    const result = await this.appService.findCommentByUserAndDelete({
      id,
      refreshToken,
      commentId,
    });
    return await result.toPromise();
  }

  @Query(() => GetPopularPostReturns)
  async GetPopularPost() {
    const result = await this.appService.getPopularPost();
    return await result.toPromise();
  }
}
