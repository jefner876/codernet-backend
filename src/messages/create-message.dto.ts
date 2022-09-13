import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  room: string;
}
