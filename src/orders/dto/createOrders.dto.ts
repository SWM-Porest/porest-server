import { IsNotEmpty } from 'class-validator';
import { Mixed } from 'mongoose';

export class CreateOrdersDto {
  @IsNotEmpty()
  restaurant_id: string;

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  table_id: number;

  @IsNotEmpty()
  menus: Mixed;
}
