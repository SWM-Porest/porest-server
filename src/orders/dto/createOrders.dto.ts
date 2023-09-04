import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Mixed } from 'mongoose';

export class CreateOrdersDto {
  @ApiProperty({ example: '60b9b0b9e6b3b3a0e4b9e0a0', description: '주문할 레스토랑의 ID', required: true })
  @IsNotEmpty()
  restaurant_id: string;

  @ApiProperty({ example: '60b9b0b9e6b3b3a0e4b9e0a0', description: '주문할 유저의 ID', required: true })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 1, description: '주문할 테이블의 number', required: true })
  @IsNotEmpty()
  table_id: number;

  @ApiProperty({ example: '주문할 메뉴들', description: '주문할 메뉴들', required: true })
  @IsNotEmpty()
  menus: Mixed;
}
