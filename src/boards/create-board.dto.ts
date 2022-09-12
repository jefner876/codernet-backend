import { IsNotEmpty, IsUrl } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateBoardDto {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  @IsUrl()
  icon: string;

  postCount: number;

  subscriberCount: number;

  subscribers: [ObjectId];
}

export class JoinBoardDto {
  @IsNotEmpty()
  userId: ObjectId;

  @IsNotEmpty()
  boardId: ObjectId;
}
