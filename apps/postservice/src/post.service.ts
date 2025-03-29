import { CreatePostArgs, Empty } from '@app/common';
import { Post, PostDocumentType } from '@app/common/schemas/post.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocumentType>,
  ) {}
  getPosts() {}

  getPost() {}

  async createPost(request: CreatePostArgs): Promise<Empty> {
    const authorId = new Types.ObjectId(request.authorId);
    await this.postModel.create({
      imageUrl: request.imageUrl,
      title: request.title,
      body: request.body,
      authorId,
      category: request.category,
    });
    return {};
  }

  addLikeById() {}

  addDisLikeById() {}

  addCommentById() {}
}
