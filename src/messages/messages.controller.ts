import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
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

  @Get(':id')
  async getMessagesById(@Param() { id }) {
    const message = await this.messagesService.getMessageById(id);
    return { message };
  }

  @Post()
  async createNewMessage(
    @Body(whitelistValidation) createMessageDto: CreateMessageDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(createMessageDto.userId)) {
      throw new BadRequestException('Invalid User ID');
    }
    const newMessage = await this.messagesService.create(createMessageDto);
    return { newMessage };
  }
}
