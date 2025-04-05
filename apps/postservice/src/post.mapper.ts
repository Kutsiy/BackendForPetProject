import { PostDocumentType } from '@app/common/schemas/post.schema';
import { Expose, Type, Transform, plainToInstance } from 'class-transformer';

export class CommentDto {
  @Expose()
  @Transform(({ value }) => value.toString())
  userId: string;

  @Expose()
  text: string;

  @Expose()
  createdAt: number;
}

export class PostDto {
  @Expose()
  @Transform(({ value }) => value.toString())
  id: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ value }) => value.toString())
  authorId: string;

  @Expose()
  authorName: string;

  @Expose()
  category: string;

  @Expose()
  views: number;

  @Expose()
  @Transform(({ value }) => value.map((v) => v.toString()))
  viewsBy: string[];

  @Expose()
  likes: number;

  @Expose()
  dislikes: number;

  @Expose()
  @Transform(({ value }) => value.map((v) => v.toString()))
  likedBy: string[];

  @Expose()
  @Transform(({ value }) => value.map((v) => v.toString()))
  dislikedBy: string[];

  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  @Transform(({ value }) => value.getTime())
  createdAt: number;
}

export class PostMapper {
  static toDto(post: PostDocumentType): PostDto {
    const json = post.toObject({ virtuals: true });
    return plainToInstance(PostDto, json, { excludeExtraneousValues: true });
  }

  static toDtoArray(posts: PostDocumentType[]): PostDto[] {
    return posts.map(PostMapper.toDto);
  }
}
