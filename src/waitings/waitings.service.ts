import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { WaitingsRepository } from './waitings.repository';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { Waiting, WaitingStatus } from './schemas/waiting.schema';

@Injectable()
export class WaitingsService {
  constructor(
    private readonly waitingsRepository: WaitingsRepository,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(createWaitingDto: CreateWaitingDto, userId: string): Promise<Waiting> {
    const restaurantId: string = createWaitingDto.restaurant_id;
    try {
      const waiting: Waiting = await this.findOneActive(userId, restaurantId, WaitingStatus.CALL);
      if (waiting) {
        throw new BadRequestException('이미 대기 중입니다.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.restaurantsService.findOne(restaurantId);
        createWaitingDto['user_id'] = userId;

        return await this.waitingsRepository.create(createWaitingDto);
      } else {
        throw error;
      }
    }
  }

  async findOneActive(userId: string, restaurantId: string, status: WaitingStatus): Promise<Waiting> {
    const waiting: Waiting = await this.waitingsRepository.findOneActive(userId, restaurantId, status);
    if (!waiting) {
      throw new NotFoundException('대기 정보가 없습니다.');
    }
    return waiting;
  }

  async cancelWaiting(waiting: Waiting, userNick: string): Promise<Waiting> {
    await this.findOneActive(waiting.user_id, waiting.restaurant_id, WaitingStatus.SEATED);
    waiting.status = 4;
    waiting['canceled_by'] = userNick;

    return await this.waitingsRepository.update(waiting);
  }

  async callWaiting(waiting: Waiting, restaurantsId: string[]): Promise<Waiting> {
    await this.validateRestaurant(waiting.restaurant_id, restaurantsId);
    await this.findOneActive(waiting.user_id, waiting.restaurant_id, WaitingStatus.WAITING);
    waiting.status = 2;

    return await this.waitingsRepository.update(waiting);
  }

  async validateRestaurant(restaurant_id: string, restaurantsId: string[]) {
    if (restaurantsId.includes(restaurant_id)) {
      return true;
    }
    throw new BadRequestException('해당 요청에 대한 권한이 없습니다.');
  }
}
