import {
  IsEmail,
  IsNotEmpty,
  IsUrl,
  IsDate,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  location: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsOptional()
  bio: string;

  @IsDate()
  @IsOptional()
  dateOfBirth: string;
}

export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  bio?: string;
}
