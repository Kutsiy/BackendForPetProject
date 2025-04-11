import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserRatePostDocumentType = HydratedDocument<UserRatePost>;

@Schema({ timestamps: true })
export class UserRatePost {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  postId: Types.ObjectId;

  @Prop({ enum: ['like', 'dislike'], required: true })
  rating: 'like' | 'dislike';
}

export const UserRatePostSchema = SchemaFactory.createForClass(UserRatePost);

export type UserRatePostType = InstanceType<typeof UserRatePost>;
