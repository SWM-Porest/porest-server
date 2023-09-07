import { BadRequestException, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { Order } from './schemas/orders.schema';
import { Types, isValidObjectId } from 'mongoose';
import { UsersService } from 'src/auth/user.service';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository, private readonly usersService: UsersService) {}

  async createOrder(createOrdersDto: CreateOrdersDto): Promise<Order> {
    return await this.ordersRepository.createOrder(createOrdersDto);
  }

  async updateOrder(updateOrdersDto: UpdateOrdersDto, id: Types.ObjectId): Promise<Order> {
    return await this.ordersRepository.updateOrder(updateOrdersDto, id);
  }

  async deleteOrder(_id: Types.ObjectId) {
    return await this.ordersRepository.deleteOrder(_id);
  }

  async getOrder(_id: Types.ObjectId) {
    if (isValidObjectId(_id)) {
      return await this.ordersRepository.getOrder(_id);
    }
    throw new BadRequestException('id의 Type이 올바르지 않습니다.');
  }

  async getOrders() {
    return 'getOrders';
  }

  async getOrdersByUser(id: string, page: number, pageSize: number, sort: number) {
    return await this.ordersRepository.getOrdersByUser(id, page, pageSize, sort);
  }

  async getOrdersByRestaurant(id: string, status: number): Promise<Order[]> {
    return await this.ordersRepository.getOrdersByRestaurant(new Types.ObjectId(id), status);
  }

  async validateUser(id: Types.ObjectId, user_id: Types.ObjectId) {
    if (id.equals(user_id)) {
      return true;
    }
    throw new BadRequestException('해당 요청에 대한 권한이 없습니다.');
  }

  async validateRestaurant(user_id: string, restaurant_id: string) {
    const user = await this.usersService.findUserById(user_id);
    if (user.restaurants_id.includes(restaurant_id)) {
      return true;
    }
    throw new BadRequestException('해당 요청에 대한 권한이 없습니다.');
  }
}
