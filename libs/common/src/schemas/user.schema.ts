import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocumentType = HydratedDocument<User>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  isActivated: boolean;

  @Prop()
  linkForActivate: string;

  @Prop()
  avatarLink: string;

  roles: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('roles', {
  ref: 'UserRole',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
  options: { populate: { path: 'roleId', select: 'name' } },
});
