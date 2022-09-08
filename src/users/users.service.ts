import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async updateUserProfile(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      updateUserDto,
      { new: true },
    );

    return updatedUser;
  }
}
