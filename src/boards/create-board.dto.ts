import { IsNotEmpty, IsUrl } from 'class-validator';
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

  subscribers: [];
}

export class JoinBoardDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  boardId: string;
}
