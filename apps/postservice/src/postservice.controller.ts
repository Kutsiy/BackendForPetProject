import {
  Post,
  PaginatedPosts,
  PostServiceController,
  PostServiceControllerMethods,
  PaginationArgs,
} from '@app/common';
import { BadRequestException, Controller } from '@nestjs/common';

@Controller()
@PostServiceControllerMethods()
export class PostserviceController implements PostServiceController {
  arrayOfPosts: Post[] = Array.from({ length: 100 }, (_, index) => ({
    id: `${index + 1}`,
    title: `Hello${index + 1}`,
    body: 'Hello',
  }));
  getAllPosts(request: PaginationArgs): PaginatedPosts {
    const { page, take } = request;
    if (page < 1 || take < 1) {
      throw new BadRequestException('Page and take must be positive integers.');
    }
    const skip = (page - 1) * take;
    const takePage = skip + take;
    const totalCount = this.arrayOfPosts.length;
    const pageCount = Math.ceil(totalCount / take);
    const posts = this.arrayOfPosts.slice(skip, takePage);
    if (page > pageCount) {
      throw new Error('Page > pageCount ');
    }
    return {
      posts,
      totalCount,
      currentPage: page,
      pageCount,
    };
  }
}
