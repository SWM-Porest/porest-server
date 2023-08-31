import { BadRequestException, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { Order } from './schemas/orders.schema';
import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createOrder(createOrdersDto: CreateOrdersDto): Promise<Order> {
    return await this.ordersRepository.createOrder(createOrdersDto);
  }

  async updateOrder(updateOrdersDto: UpdateOrdersDto): Promise<any> {
    return await this.ordersRepository.updateOrder(updateOrdersDto);
  }

  async deleteOrder() {
    return 'deleteOrder';
  }

  async getOrder(id: string) {
    if (isValidObjectId(id)) {
      return await this.ordersRepository.getOrder(id);
    }
    throw new BadRequestException('id의 Type이 올바르지 않습니다.');
  }

  async getOrders() {
    return 'getOrders';
  }

  async getOrdersByUser(id: Types.ObjectId, page: number, pageSize: number, sort: number) {
    return await this.ordersRepository.getOrdersByUser(id, page, pageSize, sort);
  }

  async getOrdersByRestaurant(id: Types.ObjectId, status: number) {
    return await this.ordersRepository.getOrdersByRestaurant(id, status);
  }
}
