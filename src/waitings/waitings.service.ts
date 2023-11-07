import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { WaitingsRepository } from './waitings.repository';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { Waiting, WaitingStatus, WaitingTeam } from './schemas/waiting.schema';
import { RequestUserDto } from 'src/auth/dto/requestUser.dto';
import { PushSubscriptionDto } from 'src/orders/dto/pushSubscription.dto';
import { sendNotification } from 'web-push';

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
      if (waiting === null) {
        const restaurant = await this.restaurantsService.findOne(restaurantId);
        const token = createWaitingDto?.token;
        createWaitingDto['user_id'] = user.userId;
        createWaitingDto['user_nick'] = user.userNick;
        createWaitingDto['restaurant_name'] = restaurant.name;
        await this.waitingsRepository.updateWaitingTeam(createWaitingDto.restaurant_id, 1);
        const waiting: Waiting = await this.waitingsRepository.create(createWaitingDto);
        console.log(token);

        if (token) {
          await this.notifyCreateWaiting(token);
        }
        return waiting;
      } else {
        throw new BadRequestException('이미 대기 중입니다.');
      }
    } catch (error) {
      throw new BadRequestException('대기 정보 등록에 실패했습니다.');
    }
  }

  async findUniqueActive(userId: string, restaurantId: string, status: WaitingStatus): Promise<Waiting> {
    return await this.waitingsRepository.findUniqueActive(userId, restaurantId, status);
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
    const payload = JSON.stringify({
      title: `매장 대기가 취소되었습니다.`,
      body: '이용해 주셔서 감사합니다.',
      tag: 'Notification Tag',
      requireInteraction: true,
    });
    if (waiting.user_id != user.userId) {
      throw new BadRequestException('본인의 대기 정보만 취소할 수 있습니다.');
    }
    const canceledWaiting: Waiting = await this.cancelWaiting(waiting, user.userNick);
    if (canceledWaiting.token) {
      await this.notifyWaiting(canceledWaiting.token, payload);
    }
    return waiting;
  }

  async cancelWaiting(waiting: Waiting, userNick: string): Promise<Waiting> {
    waiting.status = 4;
    waiting['canceled_by'] = userNick;
    await this.waitingsRepository.updateWaitingTeam(waiting.restaurant_id, -1);

    return await this.waitingsRepository.update(waiting);
  }

  async callWaiting(waitingId: string, restaurantsId: string[]): Promise<Waiting> {
    const payload = JSON.stringify({
      title: `지금 매장으로 입장해주세요.`,
      body: '5분동안 미입장 시, 자동 취소됩니다.',
      tag: 'Notification Tag',
      requireInteraction: true,
    });
    const waiting: Waiting = await this.findOneActive(waitingId, WaitingStatus.WAITING);
    await this.validateRestaurant(waiting.restaurant_id, restaurantsId);
    waiting.status = 2;
    await this.waitingsRepository.updateWaitingTeam(waiting.restaurant_id, -1);

    if (waiting.token) {
      await this.notifyWaiting(waiting.token, payload);
    }
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

  async getWaitingTeamStand(restaurantId: string, waitingId: string): Promise<number> {
    return await this.waitingsRepository.getWaitingTeamStand(restaurantId, waitingId);
  }

  async updateWaitingTeam(restaurantId: string, updateNumber: number): Promise<WaitingTeam> {
    return await this.waitingsRepository.updateWaitingTeam(restaurantId, updateNumber);
  }

  async notifyCreateWaiting(token: PushSubscriptionDto) {
    // payload는 인자로 받아서 처리해야함, 현재는 테스트용
    const testPayload = JSON.stringify({
      title: `대기열이 등록 되었습니다.`,
      badge: 'https://pocketrestaurant.net/favicon.ico',
      body: '매장에 늦지않게 방문 부탁드립니다.',
      tag: 'Notification Tag',
      requireInteraction: true,
    });

    try {
      await sendNotification(token, testPayload).then((res) => {
        console.log(res.statusCode);
        return res.statusCode;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async notifyWaiting(token: PushSubscriptionDto, payload: string) {
    console.log(token);
    try {
      await sendNotification(token, payload);
    } catch (error) {
      console.log(error);
    }
  }
}
