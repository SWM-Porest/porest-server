import { IsNotEmpty } from 'class-validator';
import { Order } from '../schemas/orders.schema';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrdersByUserDto {
  @ApiProperty({ example: '[{order1}, {order2}]', description: '로그인한 유저가 주문한 내역', required: false })
  orders: Order[];

  @ApiProperty({ example: 1, description: '현재 페이지 번호', required: true })
  @IsNotEmpty()
  page: number;

  @ApiProperty({ example: 10, description: '한 페이지에 보여줄 주문의 개수', required: true })
  @IsNotEmpty()
  pageSize: number;

  @ApiProperty({ example: 1, description: '정렬 방식 0: 최신순 1: 오래된순', required: true })
  @IsNotEmpty()
  sort: number;
}
