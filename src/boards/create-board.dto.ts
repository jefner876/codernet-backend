import { IsNotEmpty } from 'class-validator';
export class CreateBoardDto {
  @IsNotEmpty()
  boardname: string;
}
