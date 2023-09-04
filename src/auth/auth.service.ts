import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { UsersService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateKakaoUser(user_id: number): Promise<any> {
    const user = await this.usersService.findUserByKakaoId(user_id);
    if (!user) {
      return null;
    }
    return user;
  }

  async createLoginToken(user: User) {
    const payload = {
      userId: user._id,
      userNick: user?.nickname,
      userlevel: user.userlevel,
      userToken: 'accessToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    const payload = {
      userId: user._id,
      userToken: 'refreshToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
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
