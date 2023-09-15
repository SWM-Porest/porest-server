import { IsEnum } from 'class-validator';
import { Schema } from 'mongoose';
import { OrderStatus, StatusUpdatedAt } from '../schemas/orders.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersDto {
  @ApiProperty({ example: '60f0c9f3e6b3f3a8c8b0b3a0', description: '수정할 주문의 id', required: true })
  _id: string;

  @ApiProperty({ example: '수정된 메뉴들', description: '수정된 메뉴들', required: false })
  menus: Schema.Types.Mixed;

  @ApiProperty({ example: 1, description: '수정할 주문의 상태', required: true })
  @IsEnum(OrderStatus)
  status: number;

  @ApiProperty({ example: 1, description: '수정한 상태의 updated_at', required: false })
  status_updated_at: StatusUpdatedAt;
}
