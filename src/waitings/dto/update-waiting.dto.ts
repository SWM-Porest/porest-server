import { PartialType } from '@nestjs/swagger';
import { CreateWaitingDto } from './create-waiting.dto';

export class UpdateWaitingDto extends PartialType(CreateWaitingDto) {}
