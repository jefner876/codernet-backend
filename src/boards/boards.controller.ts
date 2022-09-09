import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { whitelistValidation } from '../validator';

import { CreateBoardDto, JoinBoardDto } from './create-board.dto';

import { BoardsService } from './boards.service';

@Controller('/api/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async getBoards() {
    const boards = await this.boardsService.getBoards();
    return { boards };
  }
  @Get(':id')
  async getBoardById(@Param() { id }) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Board ID');
    }
    const board = await this.boardsService.getBoardById(id);
    if (!board) {
      throw new NotFoundException('Board ID not found');
    }
    return { board };
  }

  @Post()
  async createNewBoard(
    @Body(whitelistValidation) createBoardDto: CreateBoardDto,
  ) {
    if (!createBoardDto.topic || !createBoardDto.subject) {
      throw new BadRequestException('Missing required data');
    }
    const newBoard = await this.boardsService.create(createBoardDto);
    return { newBoard };
  }

  @Patch()
  async joinBoard(@Body() joinBoardDto: JoinBoardDto) {
    const updatedBoard = await this.boardsService.joinBoard(joinBoardDto);

    return { updatedBoard };
  }
}
