import { IsEnum, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class RegistUserDTO {
  social_id: number;

  social_login: string;

  @IsNotEmpty()
  @IsEnum([0, 10, 50, 100])
  userlevel: number;

  email: string;

  nickname: string;

  restaurants_id: Types.ObjectId[];
}
