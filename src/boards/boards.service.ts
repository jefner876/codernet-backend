import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, BoardDocument } from './boards.schema';
import { CreateBoardDto } from './create-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const createdBoard = new this.boardModel(createBoardDto);
    return createdBoard.save();
  }
  async getBoards(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }
  async getBoardById(id: string): Promise<Board> {
    return this.boardModel.findById(id).exec();
  }
}
