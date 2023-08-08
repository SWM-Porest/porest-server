import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async updateToken(token: string, email: string) {
    return await this.UserModel.findOne({ email }, { kakao_token: token });
  }
}
