import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocumentType = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 'description missing' })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
