import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserViewPostDocumentType = HydratedDocument<UserViewPost>;

@Schema({ timestamps: true })
export class UserViewPost {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  postId: Types.ObjectId;
}

export const UserViewPostSchema = SchemaFactory.createForClass(UserViewPost);

export type UserViewPostType = InstanceType<typeof UserViewPost>;
