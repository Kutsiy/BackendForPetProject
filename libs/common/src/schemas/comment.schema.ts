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

  @Prop()
  postIdString: string;

  @Prop()
  idString: string;
}

export const CommentPostSchema = SchemaFactory.createForClass(CommentPost);

CommentPostSchema.pre('save', function (next) {
  const doc = this as CommentPostPostDocumentType;

  if (doc.postId) {
    doc.postIdString = doc.postId.toString();
  }
  if (doc._id) {
    doc.idString = doc._id.toString();
  }

  next();
});
