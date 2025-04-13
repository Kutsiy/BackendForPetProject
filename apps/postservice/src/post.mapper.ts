import { CommentPostPostDocumentType } from '@app/common';
import { PostDocumentType } from '@app/common/schemas/post.schema';
import { Expose, Type, Transform, plainToInstance } from 'class-transformer';

export class CommentDto {
  @Expose()
  authorId: { id: string; name: string; avatarLink: string };

  @Expose()
  @Transform(({ value }) => value.toString())
  postId: string;

  @Expose()
  text: string;

  @Expose()
  @Transform(({ value }: { value: Date }) => Math.floor(value.getTime() / 1000))
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
  @Transform(({ value }) => value.map((v) => v.toString()))
  comments: string[];

  @Expose()
  commentCount: number;

  @Expose()
  @Transform(({ value }: { value: Date }) => Math.floor(value.getTime() / 1000))
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

  static CommentToDto(comment: CommentPostPostDocumentType): CommentDto {
    const json = comment.toObject({ virtuals: true });
    return plainToInstance(CommentDto, json, { excludeExtraneousValues: true });
  }

  static CommentsToDtoArray(
    comments: CommentPostPostDocumentType[],
  ): CommentDto[] {
    return comments.map(PostMapper.CommentToDto);
  }
}
