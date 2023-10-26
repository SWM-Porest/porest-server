import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTableDto {
  @ApiProperty({
    description: '매장 ID',
    required: true,
  })
  @IsNotEmpty()
  restaurant_id: Types.ObjectId;

  @ApiProperty({
    description: '테이블 이름',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '주문 IDs',
    required: false,
  })
  order_ids: Types.ObjectId[];
}
