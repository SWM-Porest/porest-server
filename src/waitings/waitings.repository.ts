import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Waiting } from './schemas/waiting.schema';
import { CreateWaitingDto } from './dto/create-waiting.dto';

@Injectable()
export class WaitingsRepository {
  constructor(@InjectModel('Waitings') private readonly waitingsModel: Model<Waiting>) {}

  async create(createWaitingDto: CreateWaitingDto): Promise<Waiting> {
    const waiting = await this.waitingsModel.create(createWaitingDto);
    return waiting;
  }
}
