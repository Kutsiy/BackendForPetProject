import { CreatePostArgs, Empty } from '@app/common';
import { Post, PostDocumentType } from '@app/common/schemas/post.schema';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Payload } from 'apps/authservice/src/token.service';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocumentType>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  getPosts() {}

  getPost() {}

  async createPost(request: CreatePostArgs): Promise<Empty> {
    const { id }: Payload = this.jwtService.decode(request.refreshToken);
    await this.postModel.create({
      imageUrl: request.imageUrl,
      title: request.title,
      body: request.body,
      authorId: id,
      category: request.category,
    });
    return {};
  }

  addLikeById() {}

  addDisLikeById() {}

  addCommentById() {}
}
