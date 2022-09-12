import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: now() })
  created_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
