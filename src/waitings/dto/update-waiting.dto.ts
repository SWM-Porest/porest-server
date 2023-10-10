import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWaitingDto } from './create-waiting.dto';
import { IsNotEmpty } from 'class-validator';
import { WaitingStatus } from '../schemas/waiting.schema';

export class UpdateWaitingDto extends PartialType(CreateWaitingDto) {
  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  status: WaitingStatus;
}
