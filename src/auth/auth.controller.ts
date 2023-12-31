import { Controller, UseGuards, Get, Post, Body, Res, Req, Headers } from '@nestjs/common';
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
import { Roles } from './decorator/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { RolesGuard } from './guard/roles.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

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
      res.cookie('access_token', req.user.access_token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        domain: process.env.COOKIE_DOMAIN,
      });
      res.cookie('refresh_token', req.user.refresh_token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
      });
    }

    res.redirect(process.env.REDIRECT_URL);
    res.end();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 하 API입니다.',
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
  @Roles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('login')
  async registUser(@Req() req: any, @Res() res: Response) {
    try {
      console.log('req.user:', req.user);
      res.json({ success: true, message: 'login success' });
    } catch (error) {
      console.log(error);
    }
    // 그 외의 경우
    return false;
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃 하는 API입니다.',
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
  @Roles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    try {
      res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN });
      res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN });
      res.json({ success: true, message: 'logout success' });
    } catch (error) {
      console.log(error);
    }
    // 그 외의 경우
    return false;
  }

  // secure된 토큰값 클라이언트 전달
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: '리프레쉬 토큰값 전달',
    description: '리프레쉬 토큰값을 전달하는 API입니다.',
  })
  @Get('getrefreshtoken')
  async getRefreshToken(@Req() req: any) {
    return !!req.cookies['refresh_token'];
  }

  // 리프레쉬 토큰을 이용한 엑세스 토큰 재발급하기
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh-accesstoken')
  async refreshAccessToken(@Req() req: any) {
    return { success: true, message: 'new accessToken Issuance success' };
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원정보 수정',
    description: '회원정보를 수정하는 API입니다.',
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
  @Roles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('update')
  async updateUser(@Req() req: any, @Body() registUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(registUserDto, req.user.userId);
    } catch (error) {
      console.log(error);
    }
    // 그 외의 경우
    return false;
  }

  @ApiBearerAuth('access-token')
  @Get('getToken')
  async getToken(@Req() req: any) {
    return { success: true, access_token: `${req.cookies['access_token']}` };
  }

  @ApiBearerAuth('access-token')
  @Roles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user')
  async getUser(@Req() req: any) {
    return this.usersService.findUserById(req.user.userId);
  }
}
