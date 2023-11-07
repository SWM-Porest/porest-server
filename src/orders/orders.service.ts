import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { Order } from './schemas/orders.schema';
import { Types, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/auth/user.service';
import { GetOrdersByUserDto } from './dto/getOrdersByUser.dto';
import { OrdersGateway } from './orders.gateway';
import { sendNotification } from 'web-push';
import { OrderStatusMessage, PushSubscriptionDto } from './dto/pushSubscription.dto';
import { RestaurantsService } from 'src/restaurants/restaurants.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersService: UsersService,
    private readonly ordersGateway: OrdersGateway,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async createOrder(createOrdersDto: CreateOrdersDto): Promise<Order> {
    // 메뉴가격, 옵션가격 검증돌리기. 이름 없으면 주문에러뱉기
    const order = await this.ordersRepository.createOrder(createOrdersDto);

    this.ordersGateway.notifyOrderInfo(order);

    return order;
  }

  async updateOrder(updateOrdersDto: UpdateOrdersDto): Promise<Order> {
    return await this.ordersRepository.updateOrder(updateOrdersDto);
  }

  async updateOrderStatus(id: Types.ObjectId, status: number): Promise<Order> {
    return await this.ordersRepository.updateOrderStatus(id, status);
  }

  async deleteOrder(_id: Types.ObjectId) {
    return await this.ordersRepository.deleteOrder(_id);
  }

  async getOrder(_id: Types.ObjectId): Promise<Order> {
    if (isValidObjectId(_id)) {
      return await this.ordersRepository.getOrder(_id);
    }
    throw new BadRequestException('id의 Type이 올바르지 않습니다.');
  }

  async getOrders() {
    return 'getOrders';
  }

  async getOrdersByUser(id: string, page: number, pageSize: number, sort: number): Promise<GetOrdersByUserDto> {
    return await this.ordersRepository.getOrdersByUser(id, page, pageSize, sort);
  }

  async getRestauarntOrdersByDate(id: string, status: number | undefined): Promise<Order[]> {
    if (status === undefined || Number.isNaN(status)) {
      return await this.ordersRepository.getRestauarntOrdersByDate(id);
    } else {
      return await this.ordersRepository.getRestauarntOrdersByDateWithStatus(id, status);
    }
  }

  async validateUser(id: Types.ObjectId, user_id: Types.ObjectId) {
    if (id.equals(user_id)) {
      return true;
    }
    throw new BadRequestException('해당 요청에 대한 권한이 없습니다.');
  }

  // 유저가 해당 주문의 접근 권한이 있는지 확인
  async validateRestaurant(restaurant_id: string, restaurantsId: string[]) {
    if (restaurantsId.includes(restaurant_id)) {
      return true;
    }

    throw new UnauthorizedException('해당 요청에 대한 권한이 없습니다.');
  }

  async notifyCreateOrder(token: string) {
    // payload는 인자로 받아서 처리해야함, 현재는 테스트용
    const testPayload = JSON.stringify({
      title: `주문이 접수 되었습니다.`,
      badge: 'https://pocketrestaurant.net/favicon.ico',
      body: '매장에서 주문확인 중입니다.',
      tag: 'Notification Tag',
      requireInteraction: true,
    });

    try {
      // await sendNotification(token, testPayload);
    } catch (error) {
      console.log(error);
    }
  }

  async notifyUpdateOrder(token: string, status: number) {
    const payload = JSON.stringify({
      title: `주문의 상태가 변경되었습니다.`,
      body: `${status as OrderStatusMessage}`,
      tag: 'Notification Tag',
      requireInteraction: true,
    });
    try {
      // await sendNotification(token, payload);
    } catch (error) {
      console.log(error);
    }
  }
}
