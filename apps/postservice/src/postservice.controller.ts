import {
  Post,
  PaginatedPosts,
  PostServiceController,
  PostServiceControllerMethods,
  PaginationArgs,
  FindPostById,
  CreatePostArgs,
  Empty,
} from '@app/common';
import { BadRequestException, Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as request from 'supertest';
import { PostService } from './post.service';

@Controller()
@PostServiceControllerMethods()
export class PostserviceController implements PostServiceController {
  constructor(private readonly postService: PostService) {}

  arrayOfWord = [
    'Hello Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag.',
    'Hello Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag.',
    'Hello Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag.',
    'Hello Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag.',
    'Hello Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag.',
    'Hello Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag.',
    'Hello Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag Lorem ipsum dolor sit am eiusmod tempor incididunt ut labore et dolore mag.  ',
  ];

  arrayOfPosts: Post[] = Array.from({ length: 1000 }, (_, index) => ({
    id: `${index + 1}`,
    title: `Hello${index + 1}`,
    body:
      this.arrayOfWord
        .slice(0, Math.floor(Math.random() * this.arrayOfWord.length - 1))
        .join('\n ') || 'Hello',
  }));
  getAllPosts(request: PaginationArgs): PaginatedPosts {
    const { searchString, page, take } = request;
    let allPosts = this.arrayOfPosts;
    if (searchString !== '' && searchString) {
      allPosts = this.arrayOfPosts.filter((val: any) =>
        val.title.toLowerCase().includes(searchString.toLowerCase()),
      );
      if (allPosts.length === 0) {
        allPosts = [{ id: '-empty', title: 'none', body: 'none' }];
      }
    }
    const isEmpty = allPosts.length === 0 || allPosts[0].id === '-empty';
    if (page < 1 || take < 1) {
      throw new BadRequestException('Page and take must be positive integers.');
    }
    const skip = (page - 1) * take;
    const takePage = skip + take;
    const totalCount = allPosts.length;
    const pageCount = Math.ceil(totalCount / take);
    const posts = allPosts.slice(skip, takePage);
    if (page > pageCount) {
      throw new Error('Page > pageCount ');
    }
    return {
      posts,
      totalCount,
      currentPage: page,
      pageCount,
      searchString,
      isEmpty,
    };
  }
  getPost(request: FindPostById): Post {
    const { id } = request;
    const result = this.arrayOfPosts.find((postsId) => id === postsId.id);
    if (result === undefined) {
      return {
        id: 'none',
        body: 'none',
        title: 'none',
      };
    }
    return result;
  }

  async createPost(request: CreatePostArgs): Promise<Empty> {
    throw new Error('Method not implemented.');
  }
}
