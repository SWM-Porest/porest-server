import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReadWaitingDto {
  @ApiProperty({
    example: '60b9b0b9e6b3b3a0e4b9e0a0',
    description: '웨이팅 데이터의 ID',
    required: true,
  })
  @IsNotEmpty()
  _id: string;
}
