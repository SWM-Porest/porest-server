import { IsNotEmpty, IsString } from 'class-validator';

export class RegistUserDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}
