import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './schemas/user.schema';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(user_id: number) {
    return await this.userModel.findOne({ id: user_id }).exec();
  }

  async create(user: User): Promise<User> {
    return await this.usersRepository.createUser(user);
  }
}
