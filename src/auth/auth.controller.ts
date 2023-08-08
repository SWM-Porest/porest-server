import { Controller, UseGuards, Get, Post, Body, Res, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './user.service';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { RegistUserDTO } from './dto/registUser.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인을 하는 API입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaoLogin() {
    return;
  }

  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 로그인시 콜백 라우터입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async kakaocallback(@Req() req, @Res() res: Response) {
    if (req.user.type === 'login') {
      res.cookie('access_token', req.user.access_token);
      res.cookie('refresh_token', req.user.refresh_token);
    } else {
      res.cookie('once_token', req.user.once_token);
    }
    res.redirect('login');
    res.end();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '정상 요청',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '잘못된 정보 요청',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '토큰 에러',
  })
  @UseGuards(JwtAuthGuard)
  @Post('login')
  async registUser(@Request() req: any, @Body() registUserDTO: RegistUserDTO, @Res() res: Response) {
    try {
      console.log('req.user:', req.user);
      const { user_email, user_nick, user_token } = req.user;
      const { email } = registUserDTO;
      // 1회용 토큰인경우
      if (user_token === 'onceToken') {
        await this.usersService.create({
          id: 2953046041,
          email: email,
          nickname: user_nick,
          kakao_access_token: '',
          kakao_refresh_token: '',
        });
        const user = await this.authService.validateUser(user_email);
        const access_token = await this.authService.createLoginToken(user);
        const refresh_token = await this.authService.createRefreshToken(user);

        res.setHeader('access_token', access_token);
        res.setHeader('refresh_token', refresh_token);
        res.json({ success: true, message: 'user login successful' });
      }
    } catch (error) {
      console.log(error);
    }
    // 그 외의 경우
    return false;
  }

  // 리프레쉬 토큰을 이용한 엑세스 토큰 재발급하기
  @UseGuards(JwtRefreshGuard)
  @Get('refresh-accesstoken')
  async refreshAccessToken() {
    return { success: true, message: 'new accessToken Issuance success' };
  }
}
