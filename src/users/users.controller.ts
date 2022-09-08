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

import { CreateUserDto, UpdateUserDto } from './create-user.dto';

import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return { users };
  }
  @Get(':id')
  async getUserById(@Param() { id }) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid User ID');
    }
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User ID not found');
    }
    return { user };
  }

  @Post()
  async createNewUser(@Body(whitelistValidation) createUserDto: CreateUserDto) {
    if (!createUserDto.email || !createUserDto.username) {
      throw new BadRequestException('Missing required data');
    }
    const newUser = await this.usersService.create(createUserDto);
    return { newUser };
  }

  @Patch(':id')
  async updateUserProfile(
    @Param() { id },
    @Body(whitelistValidation)
    updateUserDto: UpdateUserDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid User ID');
    }
    const updatedUser = await this.usersService.updateUserProfile(
      id,
      updateUserDto,
    );
    if (!updatedUser) {
      throw new NotFoundException('User ID not found');
    }
    return { updatedUser };
  }
}
