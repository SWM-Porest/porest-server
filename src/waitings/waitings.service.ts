import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { WaitingsRepository } from './waitings.repository';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { Waiting, WaitingStatus, WaitingTeam } from './schemas/waiting.schema';
import { RequestUserDto } from 'src/auth/dto/requestUser.dto';
import { Types } from 'mongoose';

@Injectable()
export class WaitingsService {
  constructor(
    private readonly waitingsRepository: WaitingsRepository,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(createWaitingDto: CreateWaitingDto, user: RequestUserDto): Promise<Waiting> {
    const restaurantId: string = createWaitingDto.restaurant_id;
    try {
      const waiting: Waiting = await this.findUniqueActive(user.userId, restaurantId, WaitingStatus.CALL);
      if (waiting) {
        throw new BadRequestException('이미 대기 중입니다.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        const restaurant = await this.restaurantsService.findOne(restaurantId);
        createWaitingDto['user_id'] = user.userId;
        createWaitingDto['user_nick'] = user.userNick;
        createWaitingDto['restaurant_name'] = restaurant.name;
        await this.waitingsRepository.updateWaitingTeam(createWaitingDto.restaurant_id, 1);

        return await this.waitingsRepository.create(createWaitingDto);
      } else {
        throw error;
      }
    }
  }

  async findUniqueActive(userId: string, restaurantId: string, status: WaitingStatus): Promise<Waiting> {
    const waiting: Waiting = await this.waitingsRepository.findUniqueActive(userId, restaurantId, status);
    if (!waiting) {
      throw new NotFoundException('대기 정보가 없습니다.');
    }
    return waiting;
  }

  async findOneActive(waitingId: string, status: WaitingStatus): Promise<Waiting> {
    const waiting: Waiting = await this.waitingsRepository.findOneActive(waitingId, status);
    if (!waiting) {
      throw new NotFoundException('대기 정보가 없습니다.');
    }
    return waiting;
  }

  async seatedWaiting(waitingId: string): Promise<Waiting> {
    const waiting: Waiting = await this.findOneActive(waitingId, WaitingStatus.CALL);
    waiting.status = WaitingStatus.SEATED;
    return await this.waitingsRepository.update(waiting);
  }

  async cancelOwnWaiting(waiting: Waiting, user: RequestUserDto): Promise<Waiting> {
    if (waiting.user_id != user.userId) {
      throw new BadRequestException('본인의 대기 정보만 취소할 수 있습니다.');
    }
    await this.cancelWaiting(waiting, user.userNick);
    return waiting;
  }

  async cancelWaiting(waiting: Waiting, userNick: string): Promise<Waiting> {
    waiting.status = 4;
    waiting['canceled_by'] = userNick;
    await this.waitingsRepository.updateWaitingTeam(waiting.restaurant_id, -1);

    return await this.waitingsRepository.update(waiting);
  }

  async callWaiting(waitingId: string, restaurantsId: string[]): Promise<Waiting> {
    const waiting: Waiting = await this.findOneActive(waitingId, WaitingStatus.WAITING);
    await this.validateRestaurant(waiting.restaurant_id, restaurantsId);
    waiting.status = 2;
    await this.waitingsRepository.updateWaitingTeam(waiting.restaurant_id, -1);

    return await this.waitingsRepository.update(waiting);
  }

  async validateRestaurant(restaurant_id: string, restaurantsId: string[]) {
    if (restaurantsId.includes(restaurant_id)) {
      return true;
    }
    throw new BadRequestException('해당 요청에 대한 권한이 없습니다.');
  }

  async findAllWaitingList(restaurantId: string): Promise<Waiting[]> {
    return await this.waitingsRepository.findAllWaitingList(restaurantId);
  }

  async getWaitingTeam(restaurantId: string): Promise<WaitingTeam> {
    return await this.waitingsRepository.getWaitingTeam(restaurantId);
  }

  async updateWaitingTeam(restaurantId: string, updateNumber: number): Promise<WaitingTeam> {
    return await this.waitingsRepository.updateWaitingTeam(restaurantId, updateNumber);
  }
}
