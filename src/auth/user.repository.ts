import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async createUser(user: User) {
    return await this.UserModel.create(user);
  }
}
