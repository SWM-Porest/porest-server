import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PushSubscriptionDto } from 'src/orders/dto/pushSubscription.dto';

export class CreateWaitingDto {
  @ApiProperty({ example: '64c7031423eb115c376d6488', description: '대기할 레스토랑의 ID', required: true })
  @IsNotEmpty()
  restaurant_id: string;

  @ApiProperty({
    example: 2,
    description: '대기할 인원 수',
    required: true,
  })
  @IsNotEmpty()
  head_count: number;

  token?: string = null;
}
