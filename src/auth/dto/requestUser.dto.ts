import { UserRole } from '../schemas/user.schema';

export class RequestUserDto {
  userId: string;
  userNick: string;
  userlevel: UserRole;
  userToken: string;
}
