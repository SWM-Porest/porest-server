import { IsEnum, IsNotEmpty } from 'class-validator';
import { Mixed, ObjectId } from 'mongoose';
import { OrderStatus } from '../schemas/orders.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersDto {
  @ApiProperty({ example: 'ObjectId', description: '수정할 레스토랑의 ID', required: true })
  @IsNotEmpty()
  _id: ObjectId;

  @ApiProperty({ example: 'ObjectId', description: '수정할 유저의 ID', required: false })
  user_id: string;

  @ApiProperty({ example: 1, description: '수정할 테이블의 number', required: false })
  table_id: number;

  @ApiProperty({ example: '수정된 메뉴들', description: '수정된 메뉴들', required: false })
  menus: Mixed;

  @ApiProperty({ example: 1, description: '수정할 주문의 상태', required: true })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: number;
}
