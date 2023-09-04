import { Types } from 'mongoose';

export class RegistUserDTO {
  _id: Types.ObjectId;

  social_id: number;

  userlevel: number;

  email: string;

  nickname: string;
}
