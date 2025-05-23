import {
  Post,
  PaginatedPosts,
  PostServiceController,
  PostServiceControllerMethods,
  PaginationArgs,
  FindPostById,
  CreatePostArgs,
  Empty,
  CreatePostReturns,
  AddViewAReturns,
  AddViewArgs,
  AddLikeArgs,
  AddLikeReturns,
  GetPostReturns,
  AddDislikeArgs,
  AddDislikeReturns,
  AddCommentArgs,
  AddCommentReturn,
  GetPostByUserArgs,
  GetPostByUserReturn,
  FindPostByUserAndDeleteArgs,
  FindPostByUserAndDeleteReturn,
  FindCommentByUserAndDeleteArgs,
  FindCommentByUserAndDeleteReturn,
  GetPopularPostReturn,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { PostService } from './post.service';
import { PostMapper } from './post.mapper';
import { Observable } from 'rxjs';

@Controller()
@PostServiceControllerMethods()
export class PostserviceController implements PostServiceController {
  constructor(private readonly postService: PostService) {}

  async getAllPosts(request: PaginationArgs): Promise<PaginatedPosts> {
    const { searchString, page, take, category, sortFilter } = request;
    const result = await this.postService.getPosts(
      searchString,
      page,
      take,
      category,
      sortFilter,
    );
    if (!result || !result.posts) {
      throw new Error('Posts data is missing or undefined');
    }
    const {
      posts,
      totalCount,
      currentPage,
      pageCount,
      searchString: searchStringResult,
      isEmpty,
    } = result;
    const changedPosts = posts.length > 0 ? PostMapper.toDtoArray(posts) : null;
    return {
      posts: changedPosts,
      totalCount,
      currentPage,
      pageCount,
      searchString: searchStringResult,
      isEmpty,
    };
  }
  async getPost(request: FindPostById): Promise<GetPostReturns> {
    const { id, refreshToken } = request;
    const { post, rate, comments } = await this.postService.getPost(
      id,
      refreshToken,
    );
    if (post === undefined) {
      return {
        post: {
          id: 'none',
          body: 'none',
          description: 'none',
          title: 'none',
          authorId: 'none',
          authorName: 'none',
          category: 'none',
          comments: [],
          createdAt: 0,
          dislikedBy: [],
          dislikes: 0,
          likes: 0,
          likedBy: [],
          views: 0,
          viewsBy: [],
          commentCount: 0,
        },
        comments: [],
        rate: {
          userSetLike: false,
          userSetDislike: false,
        },
      };
    }
    return {
      post: PostMapper.toDto(post),
      rate,
      comments: PostMapper.CommentsToDtoArray(comments),
    };
  }

  async createPost(request: CreatePostArgs): Promise<CreatePostReturns> {
    await this.postService.createPost(request);
    return { result: 'post created successfully' };
  }

  async addView(request: AddViewArgs): Promise<AddViewAReturns> {
    return await this.postService.addViewById(request);
  }

  async addLike(request: AddLikeArgs): Promise<AddLikeReturns> {
    return await this.postService.addLikeById(request);
  }

  async addDislike(request: AddDislikeArgs): Promise<AddDislikeReturns> {
    return await this.postService.addDisLikeById(request);
  }

  async addComment(request: AddCommentArgs): Promise<AddCommentReturn> {
    return await this.postService.addCommentById(request);
  }

  async getPostByUser(
    request: GetPostByUserArgs,
  ): Promise<GetPostByUserReturn> {
    return await this.postService.getPostByUser(request);
  }

  async findPostByUserAndDelete(
    request: FindPostByUserAndDeleteArgs,
  ): Promise<FindPostByUserAndDeleteReturn> {
    return await this.postService.findPostByUserAndDelete(request);
  }

  async getViewPostByUser(
    request: GetPostByUserArgs,
  ): Promise<GetPostByUserReturn> {
    return await this.postService.getViewPostByUser(request);
  }
  async getRatePostByUser(
    request: GetPostByUserArgs,
  ): Promise<GetPostByUserReturn> {
    return await this.postService.getRatePostByUser(request);
  }

  async findCommentByUserAndDelete(
    request: FindCommentByUserAndDeleteArgs,
  ): Promise<FindCommentByUserAndDeleteReturn> {
    return await this.postService.findCommentByUserAndDelete(request);
  }

  async getPopularPost(request: Empty): Promise<GetPopularPostReturn> {
    return await this.postService.getPopularPost();
  }
}
