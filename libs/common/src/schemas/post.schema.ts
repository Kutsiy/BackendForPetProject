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

  @Prop({ default: 0 })
  views: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  viewsBy: Types.ObjectId[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  dislikes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  dislikedBy: Types.ObjectId[];

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: {
          type: Number,
          default: () => new Date().getTime(),
          get: () => new Date().getTime(),
        },
      },
    ],
    default: [],
  })
  comments: {
    userId: Types.ObjectId;
    text: string;
    createdAt: number;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostType = InstanceType<typeof Post>;
