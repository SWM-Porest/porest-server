import { IsEnum, IsNotEmpty } from 'class-validator';
import { Mixed } from 'mongoose';
import { OrderStatus } from '../schemas/orders.schema';

export class UpdateOrdersDto {
  @IsNotEmpty()
  _id: string;

  table_id: number;

  user_id: string;

  menus: Mixed;

  @IsEnum(OrderStatus)
  status: number;
}
