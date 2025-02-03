import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserRoleDocumentType = HydratedDocument<UserRole>;

@Schema()
export class UserRole {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', unique: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Role', unique: true })
  roleId: Types.ObjectId;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
