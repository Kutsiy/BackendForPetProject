import {
  AddLikeArgs,
  AddLikeReturns,
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

type AddRateArgs = {
  id: string;
  refreshToken: string;
};

type AddRateReturns = {
  result: string;
  currentLikeCount: number;
  currentDislikeCount: number;
};

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

  async addLikeById(args: AddLikeArgs): Promise<AddLikeReturns> {
    return await this.addRate(args, 'like');
  }

  async addDisLikeById(args) {
    return await this.addRate(args, 'dislike');
  }

  async addRate(
    args: AddRateArgs,
    type: 'like' | 'dislike',
  ): Promise<AddRateReturns> {
    const { id, refreshToken } = args;
    const { id: userId }: Payload = this.jwtService.decode(refreshToken);
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new Error('Post not found');
    }
    const hasLiked = post.likedBy.some((like) => like.equals(userId));
    const hasDisliked = post.dislikedBy.some((dislike) =>
      dislike.equals(userId),
    );
    if (type === 'like') {
      if (hasDisliked && !hasLiked) {
        await this.removeFromArrayField(post, 'dislikedBy', userId);
        await this.addToArrayField(post, 'likedBy', userId);
        return this.buildResponse('Added Like', post);
      }

      if (hasLiked) {
        await this.removeFromArrayField(post, 'likedBy', userId);
        return this.buildResponse('Removed Like', post);
      }

      await this.addToArrayField(post, 'likedBy', userId);
      return this.buildResponse('Added Like', post);
    }

    if (type === 'dislike') {
      if (!hasDisliked && hasLiked) {
        await this.removeFromArrayField(post, 'likedBy', userId);
        await this.addToArrayField(post, 'dislikedBy', userId);
        return this.buildResponse('Added Dislike', post);
      }

      if (hasDisliked) {
        await this.removeFromArrayField(post, 'dislikedBy', userId);
        return this.buildResponse('Removed Dislike', post);
      }

      await this.addToArrayField(post, 'dislikedBy', userId);
      return this.buildResponse('Added Dislike', post);
    }
  }

  private async addToArrayField(
    post: any,
    field: 'likedBy' | 'dislikedBy',
    userId: Types.ObjectId,
  ) {
    post[field].push(userId);
    await post.save();
  }

  private async removeFromArrayField(
    post: any,
    field: 'likedBy' | 'dislikedBy',
    userId: Types.ObjectId,
  ) {
    post[field] = post[field].filter((id) => !id.equals(userId));
    await post.save();
  }

  private buildResponse(result: string, post: any): AddRateReturns {
    return {
      result,
      currentLikeCount: post.likedBy.length,
      currentDislikeCount: post.dislikedBy.length,
    };
  }

  addCommentById() {}

  async addViewById(args: AddViewArgs) {
    const { id, refreshToken } = args;
    const { id: userId }: Payload = this.jwtService.decode(refreshToken);
    const result = await this.postModel.findById(id).exec();

    if (result.viewsBy.some((view) => view.equals(userId))) {
      return { result: 'View Don`t Add', userExists: true };
    } else {
      result.viewsBy.push(userId);
      await result.save();
      return { result: 'View Add', userExists: false };
    }
  }
}
