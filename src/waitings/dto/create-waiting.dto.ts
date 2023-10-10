import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWaitingDto {
  @IsNotEmpty()
  restaurant_id: string;
}
