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
    const { searchString, page, take } = request;
    const result = await this.postService.getPosts(searchString, page, take);
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
  async getPost(request: FindPostById): Promise<Post> {
    const { id } = request;
    const result = await this.postService.getPost(id);
    if (result === undefined) {
      return {
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
      };
    }
    return PostMapper.toDto(result);
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
}
