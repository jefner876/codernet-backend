import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  location: string;

  @Prop({
    default: 'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
  })
  avatar: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  DOB: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
