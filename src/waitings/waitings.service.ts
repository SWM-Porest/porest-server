import { Injectable } from '@nestjs/common';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { UpdateWaitingDto } from './dto/update-waiting.dto';
import { WaitingsRepository } from './waitings.repository';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { Waiting } from './schemas/waiting.schema';

@Injectable()
export class WaitingsService {
  constructor(
    private readonly waitingsRepository: WaitingsRepository,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(createWaitingDto: CreateWaitingDto, userId: string): Promise<Waiting> {
    await this.restaurantsService.findOne(createWaitingDto.restaurant_id);
    createWaitingDto['user_id'] = userId;
    return await this.waitingsRepository.create(createWaitingDto);
  }

  findAll() {
    return `This action returns all waitings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} waiting`;
  }

  update(id: number, updateWaitingDto: UpdateWaitingDto) {
    return `This action updates a #${id} waiting`;
  }

  remove(id: number) {
    return `This action removes a #${id} waiting`;
  }
}
