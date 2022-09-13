import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto';
import { MessagesService } from './messages.service';
import { whitelistValidation } from '../validator';
import mongoose from 'mongoose';

@Controller('/api/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages() {
    const messages = await this.messagesService.getMessages();
    return { messages };
  }

  @Get(':room')
  async getMessagesByRoom(@Param() { room }) {
    const messages = await this.messagesService.getMessagesByRoom(room);
    return { messages };
  }

  @Post()
  async createNewMessage(
    @Body(whitelistValidation) createMessageDto: CreateMessageDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(createMessageDto.user)) {
      throw new BadRequestException('Invalid User ID');
    }
    const newMessage = await this.messagesService.create(createMessageDto);
    return { newMessage };
  }
}
