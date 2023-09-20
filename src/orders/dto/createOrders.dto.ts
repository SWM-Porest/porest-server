import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Schema, Types } from 'mongoose';
import { OrderMenu, OrderStatus, StatusUpdatedAt } from '../schemas/orders.schema';
import { PushSubscriptionDto } from './pushSubscription.dto';

export class CreateOrdersDto {
  _id: Types.ObjectId;

  @ApiProperty({ example: '60b9b0b9e6b3b3a0e4b9e0a0', description: '주문할 레스토랑의 ID', required: true })
  @IsNotEmpty()
  restaurant_id: string;

  restaurant_name: string;

  restaurant_address: string;

  user_id: string;

  status: OrderStatus;

  status_updated_at: StatusUpdatedAt;

  @ApiProperty({ example: 1, description: '주문할 테이블의 number', required: true })
  @IsNotEmpty()
  table_id: number;

  @ApiProperty({ example: '주문할 메뉴들', description: '주문할 메뉴들', required: true })
  @IsNotEmpty()
  menus: OrderMenu;

  @ApiProperty({
    example: { endpoint: 'url', keys: { auth: 'string', p256dh: 'string' }, expirationTime: null },
    description: '유저의 푸시 알림 구독 정보',
    required: false,
  })
  token?: PushSubscriptionDto = null;
}
