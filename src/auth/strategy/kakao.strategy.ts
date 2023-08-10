import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UsersService } from '../user.service';
import { User } from '../schemas/user.schema';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const user_id = profile.id;
    const user_email = profile._json.kakao_account?.email;
    const user_nick = profile._json.properties.nickname;
    const user_profile: User = {
      id: profile.id,
      email: user_email,
      nickname: user_nick,
    };
    try {
      const user = await this.authService.validateUser(user_id);
      if (user === null) {
        // 유저가 없을때
        const newUser = await this.userService.create(user_profile);
        done(null, newUser);
      } else {
        // 유저가 있을때
        const access_token = await this.authService.createLoginToken(user);
        const refresh_token = await this.authService.createRefreshToken(user);
        return { user, access_token, refresh_token, type: 'login' };
      }
    } catch (err) {
      console.log(err);
      done(err);
    }
  }
}
