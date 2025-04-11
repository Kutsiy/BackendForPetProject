import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocumentType = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, default: null })
  imageUrl: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: String })
  authorName: string;

  // @Prop({ type: [String], default: [] })
  // tags: string[];
  @Prop({ required: true })
  category: string;

  // @Prop({ default: 0 })
  // views: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  viewsBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  dislikedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
  comments: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostType = InstanceType<typeof Post>;

PostSchema.virtual('commentCount').get(function (this: PostDocumentType) {
  return this.comments?.length || 0;
});

PostSchema.virtual('likes').get(function (this: PostDocumentType) {
  return this.likedBy?.length || 0;
});

PostSchema.virtual('dislikes').get(function (this: PostDocumentType) {
  return this.dislikedBy?.length || 0;
});

PostSchema.virtual('views').get(function (this: PostDocumentType) {
  return this.viewsBy?.length || 0;
});

PostSchema.set('toObject', { virtuals: true });
PostSchema.set('toJSON', { virtuals: true });

// {
//   userId: { type: Types.ObjectId, ref: 'User', required: true },
//   text: { type: String, required: true },
//   createdAt: {
//     type: Number,
//     default: () => new Date().getTime(),
//     get: () => new Date().getTime(),
//   },
// },
