import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegistUserDTO {
  @ApiProperty({ example: '123456', description: '카카오 고유 ID Number', required: false })
  @IsNumber()
  social_id: number;

  @ApiProperty({ example: 'kakao', description: '소셜 로그인 유형', required: false })
  @IsString()
  social_login: string;

  @ApiProperty({ example: 0, description: '유저 권한', required: false })
  @IsNotEmpty()
  @IsEnum([0, 10, 50, 100])
  userlevel: number;

  @IsOptional()
  @ApiProperty({ example: 'abc@abc.com', description: '이메일', required: false })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '닉네임', description: '김아무개', required: false })
  @MaxLength(10)
  @MinLength(2)
  nickname: string;

  restaurants_id: string[];
}
