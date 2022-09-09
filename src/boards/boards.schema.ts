import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ default: 0 })
  postCount: number;

  @Prop({ default: 0 })
  subscriberCount: number;

  @Prop({ default: [] })
  subscribers: [];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
