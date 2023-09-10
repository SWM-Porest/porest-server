import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTableDto {
  @ApiProperty({
    description: '테이블 ID',
    required: false,
  })
  @IsNotEmpty()
  _id: Types.ObjectId;
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
    description: '테이블 생성일',
    required: false,
  })
  created_at: Date;
  @ApiProperty({
    description: '테이블 수정일',
    required: false,
  })
  updated_at: Date;
}
