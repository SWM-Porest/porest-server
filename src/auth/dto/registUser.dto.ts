import { IsNotEmpty, IsNumber } from 'class-validator';

export class RegistUserDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
