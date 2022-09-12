import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { Message, MessageSchema } from './messages.schema';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
