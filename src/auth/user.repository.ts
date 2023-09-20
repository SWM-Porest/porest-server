import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { RegistUserDTO } from './dto/registUser.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async createUser(user: RegistUserDTO) {
    return await this.UserModel.create(user);
  }

  async findById(id: string) {
    const _id = new Types.ObjectId(id);
    return this.UserModel.findById(_id).exec();
  }

  async findByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }

  async findByKakaoId(id: number) {
    return await this.UserModel.findOne({ social_id: id, social_login: 'kakao' }).exec();
  }

  async updateUser(user: RegistUserDTO, id: string) {
    const _id = new Types.ObjectId(id);
    const { ...updateField } = user;
    return this.UserModel.findOneAndUpdate({ _id }, { $set: updateField }, { new: true }).exec();
  }
}
