import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  _id: Types.ObjectId;

  @IsOptional()
  @ApiProperty({ example: '123456', description: '카카오 고유 ID Number', required: false })
  @IsNumber()
  social_id: number;

  @IsOptional()
  @ApiProperty({ example: 'kakao', description: '소셜 로그인 유형', required: false })
  social_login: string;

  @IsOptional()
  @ApiProperty({ example: 0, description: '유저 권한', required: false })
  @IsEnum([0, 10, 50, 100])
  userlevel: number;

  @IsOptional()
  @ApiProperty({ example: 'abc@abc.com', description: '이메일', required: false })
  @IsEmail()
  email: string;

  @IsOptional()
  @ApiProperty({ example: '닉네임', description: '김아무개', required: false })
  @MaxLength(10)
  @MinLength(2)
  nickname: string;

  @IsOptional()
  @ApiProperty({
    example: ['123456789012345678901234', '123456789012345678901234'],
    description: '권한을 가진 식당 ID배열',
    required: false,
  })
  restaurants_id: string[];
}
