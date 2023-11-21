import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { UsersService } from './user.service';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateKakaoUser(user_id: string, email: string): Promise<any> {
    const user = await this.usersService.findUserByKakaoIdEmail(user_id, email);
    if (!user) {
      return null;
    }
    return user;
  }

  async validateEmail(email: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async createLoginToken(user: User) {
    const payload = {
      userId: user._id.toString(),
      userNick: user?.nickname,
      userlevel: user.userlevel,
      restaurantsId: user.restaurants_id,
      userToken: 'accessToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    const payload = {
      userId: user._id.toString(),
      userToken: 'refreshToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '90d',
    });
  }

  onceToken(user_profile: any) {
    const payload = {
      userEmail: user_profile.user_email,
      userNick: user_profile.user_nick,
      userToken: 'onceToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10m',
    });
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
