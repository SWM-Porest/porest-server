import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RegistUserDTO } from './dto/registUser.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async createUser(user: User) {
    return await this.UserModel.create(user);
  }

  async findById(id: number) {
    return this.UserModel.findOne({ id }).exec();
  }

  async findByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }

  async updateUser(user: RegistUserDTO) {
    const { id, ...updateField } = user;
    return this.UserModel.findOneAndUpdate({ id }, { $set: updateField }, { new: true }).exec();
  }
}
