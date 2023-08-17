import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { UsersService } from './user.service';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async validateUser(user_id: number): Promise<any> {
    const user = await this.usersService.findUserById(user_id);
    if (!user) {
      return null;
    }
    return user;
  }

  async createLoginToken(user: User) {
    const payload = {
      user_id: user.id,
      user_nick: user?.nickname,
      user_level: user.userlevel,
      user_token: 'accessToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    const payload = {
      user_id: user.id,
      user_token: 'refreshToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
  }

  onceToken(user_profile: any) {
    const payload = {
      user_email: user_profile.user_email,
      user_nick: user_profile.user_nick,
      user_token: 'onceToken',
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
