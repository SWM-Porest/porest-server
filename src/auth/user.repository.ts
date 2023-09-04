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
    return this.UserModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }

  async findByKakaoId(id: number) {
    return await this.UserModel.findOne({ social_id: id, social_login: 'kakao' }).exec();
  }

  async updateUser(user: RegistUserDTO, id: string) {
    const objId = new Object(id);
    const { _id, ...updateField } = user;
    return this.UserModel.findOneAndUpdate({ _id: objId }, { $set: updateField }, { new: true }).exec();
  }
}
