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
}
