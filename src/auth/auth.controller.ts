import { Controller, UseGuards, Get, Post, Body, Res, Req } from '@nestjs/common';
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
      res.cookie('access_token', req.user.access_token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
      res.cookie('refresh_token', req.user.refresh_token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
    }
    res.redirect(process.env.LOGIN_REDIRECT_URL);
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
  async registUser(@Req() req: any, @Body() RegistUserDTO: RegistUserDTO, @Res() res: Response) {
    try {
      console.log('req.user:', req.user);
      res.json({ success: true, message: 'login success' });
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