import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserRoleDocumentType = HydratedDocument<UserRole>;

@Schema()
export class UserRole {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Role' })
  roleId: Types.ObjectId;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
