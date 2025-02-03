import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocumentType = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
