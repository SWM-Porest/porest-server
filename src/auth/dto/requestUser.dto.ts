import { UserRole } from '../schemas/user.schema';

// RequestUserDto는 Request.user 객체의 타입을 정의합니다.
export class RequestUserDto {
  userId: string;
  userNick: string;
  userlevel: UserRole;
  userToken: string;
  restaurantsId: string[];
}
