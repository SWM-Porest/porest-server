import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Waiting, WaitingStatus } from './schemas/waiting.schema';
import { CreateWaitingDto } from './dto/create-waiting.dto';

@Injectable()
export class WaitingsRepository {
  constructor(@InjectModel('Waitings') private readonly waitingsModel: Model<Waiting>) {}

  async create(createWaitingDto: CreateWaitingDto): Promise<Waiting> {
    const waiting: Waiting = await this.waitingsModel.create(createWaitingDto);
    return waiting;
  }

  async findUniqueActive(userId: string, restaurantId: string, status: WaitingStatus): Promise<Waiting> {
    const waiting: Waiting = await this.waitingsModel
      .findOne({
        user_id: userId,
        restaurant_id: restaurantId,
        status: { $lte: status },
      })
      .exec(); // 없으면 null 반환
    return waiting;
  }

  async findOneActive(waitingId: string, status: WaitingStatus): Promise<Waiting> {
    const waiting: Waiting = await this.waitingsModel
      .findOne({
        _id: waitingId,
        status: { $lte: status },
      })
      .exec(); // 없으면 null 반환
    return waiting;
  }

  async update(waiting: Waiting): Promise<Waiting> {
    const updatedWaiting: Waiting = await this.waitingsModel
      .findOneAndUpdate(
        {
          _id: waiting._id,
        },
        waiting,
        {
          new: true,
        },
      )
      .exec();
    return updatedWaiting;
  }

  async findAllWaitingList(restaurantId: string): Promise<Waiting[]> {
    const waitingList: Waiting[] = await this.waitingsModel
      .find({
        restaurant_id: restaurantId,
        status: { $lte: WaitingStatus.CALL },
      })
      .sort({ status: -1, created_at: 1 })
      .exec();
    return waitingList;
  }
}
