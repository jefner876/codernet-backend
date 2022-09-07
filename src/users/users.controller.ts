import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post()
  createNewUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersService.create(createUserDto);
    return this.usersService.create(createUserDto);
  }
}
