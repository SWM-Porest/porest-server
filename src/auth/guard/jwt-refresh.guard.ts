import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private authService: AuthService, private userService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { refresh_token } = request.cookies;
    if (refresh_token === undefined) {
      throw new HttpException('Refresh Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    const refreshTokenValidate = await this.validate(refresh_token);

    response.cookie('access_token', refreshTokenValidate, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      domain: process.env.COOKIE_DOMAIN,
    });
    response.setHeader('access_token', refreshTokenValidate);
    response.setHeader('tokenReissue', true);

    return true;
  }

  async validate(refreshToken: string) {
    try {
      const token_verify = await this.authService.tokenValidate(refreshToken);

      const user = await this.userService.findUserById(token_verify.userId);
      return await this.authService.createLoginToken(user);
    } catch (error) {
      switch (error.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'no permission':
          throw new HttpException('해당 요청의 권한이 없습니다', 403);

        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 410);

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
