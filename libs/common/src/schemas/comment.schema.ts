import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentPostPostDocumentType = HydratedDocument<CommentPost>;

@Schema({ timestamps: true })
export class CommentPost {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
  postId: Types.ObjectId;

  @Prop({ required: true })
  text: string;
}

export const CommentPostSchema = SchemaFactory.createForClass(CommentPost);
