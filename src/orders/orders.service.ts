import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { Order } from './schemas/orders.schema';
import { Types, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/auth/user.service';
import { GetOrdersByUserDto } from './dto/getOrdersByUser.dto';
import { OrdersGateway } from './orders.gateway';
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
    if (!(await this.restaurantsService.isExistRestaurant(createOrdersDto.restaurant_id))) {
      throw new NotFoundException('해당 매장이 존재하지 않습니다.');
    }

    const order = await this.ordersRepository.createOrder(createOrdersDto);

    this.ordersGateway.notifyOrderInfo(order);

    return order;
  }

  async updateOrder(updateOrdersDto: UpdateOrdersDto, id: Types.ObjectId): Promise<Order> {
    return await this.ordersRepository.updateOrder(updateOrdersDto, id);
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

  // 유저가 해당 매장의 주문 접근 권한이 있는지 확인
  async validateRestaurant(user_id: string, restaurant_id: string) {
    const user = await this.usersService.findUserById(user_id);
    if (user.restaurants_id.includes(restaurant_id)) {
      return true;
    }
    throw new UnauthorizedException('해당 요청에 대한 권한이 없습니다.');
  }
}
