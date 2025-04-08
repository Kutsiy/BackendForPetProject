import {
  AddViewArgs,
  CreatePostArgs,
  Empty,
  User,
  UserDocumentType,
} from '@app/common';
import { Post, PostDocumentType } from '@app/common/schemas/post.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Payload } from 'apps/authservice/src/token.service';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name, 'postConnection')
    private readonly postModel: Model<PostDocumentType>,
    @InjectModel(User.name, 'userConnection')
    private readonly userModel: Model<UserDocumentType>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async getPosts(searchString: string, page: number, take: number) {
    let query = this.postModel.find();
    const countQuery = this.postModel.find();
    if (searchString && searchString !== '') {
      query = query.where('title').regex(new RegExp(searchString, 'i'));
    }
    if (page < 1 || take < 1) {
      throw new BadRequestException('Page and take must be positive integers.');
    }
    const skip = (page - 1) * take;
    const takePage = skip + take;
    const totalCount = await countQuery.countDocuments().exec();
    const pageCount = Math.ceil(totalCount / take);

    if (page > pageCount + 1) {
      throw new Error('Page > pageCount ');
    }

    const posts = await query.skip(skip).limit(takePage).exec();

    if (posts.length === 0) {
      const emptyPost = new this.postModel({
        title: 'none',
        body: 'none',
        authorId: 'none',
        category: 'none',
        comments: [],
        createdAt: 0,
        dislikedBy: [],
        dislikes: 0,
        likes: 0,
        likedBy: [],
        views: 0,
        commentCount: 0,
      });
      return {
        posts: [emptyPost],
        totalCount,
        currentPage: page,
        pageCount,
        searchString,
        isEmpty: true,
      };
    }
    return {
      posts,
      totalCount,
      currentPage: page,
      pageCount,
      searchString,
      isEmpty: false,
    };
  }

  async getPost(id: string) {
    const result = await this.postModel.findById(id).exec();
    return result;
  }

  async createPost(request: CreatePostArgs): Promise<Empty> {
    const { id, email }: Payload = this.jwtService.decode(request.refreshToken);
    const result = await this.userModel.findOne({ email: email }).exec();
    await this.postModel.create({
      imageUrl: request.imageUrl,
      title: request.title,
      body: request.body,
      description: request.description,
      authorId: id,
      authorName: result.name,
      category: request.category,
    });
    return {};
  }

  addLikeById() {}

  addDisLikeById() {}

  addCommentById() {}

  async addViewById(args: AddViewArgs) {
    const { id, refreshToken } = args;
    const { id: userId }: Payload = this.jwtService.decode(refreshToken);
    const result = await this.postModel.findById(id).exec();

    if (result.viewsBy.some((view) => view === userId)) {
      return { result: 'View Don`t Add', userExists: true };
    } else {
      result.viewsBy.push(userId);
      await result.save();
      return { result: 'View Add', userExists: false };
    }
  }
}
