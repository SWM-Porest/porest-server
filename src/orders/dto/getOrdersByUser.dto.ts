import { IsNotEmpty } from 'class-validator';
import { Order } from '../schemas/orders.schema';

export class GetOrdersByUser {
  orders: Order[];

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  pageSize: number;

  @IsNotEmpty()
  sort: number;
}
