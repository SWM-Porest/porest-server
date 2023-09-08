import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { GetOrdersByUser } from './dto/getOrdersByUser.dto';

@Injectable()
export class OrdersRepository {
  constructor(@InjectModel('Orders') private readonly Order: Model<Order>) {}

  async createOrder(createOrdersDto: CreateOrdersDto) {
    return await this.Order.create(createOrdersDto);
  }

  async updateOrder(updateOrdersDto: UpdateOrdersDto, id: Types.ObjectId): Promise<Order> {
    const isupdated = (await this.Order.updateOne({ _id: id }, updateOrdersDto)).acknowledged;
    if (!isupdated) {
      throw new BadRequestException('주문 수정에 실패했습니다.');
    }
    return this.getOrder(id);
  }

  async getOrder(_id: Types.ObjectId): Promise<Order> {
    const order = await this.Order.findById(_id).exec();
    if (order) {
      return order;
    }
    throw new NotFoundException('해당 주문이 존재하지 않습니다.');
  }

  async getOrdersByUser(id: string, page: number, pageSize: number, sort: number): Promise<GetOrdersByUser> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const orders = await this.Order.find({ user_id: id })
      .sort({ stats: 1, created_at: sort ? 1 : -1 })
      .skip(startIndex)
      .limit(endIndex)
      .exec();
    return { orders, page, pageSize, sort };
  }

  async getOrdersByRestaurant(id: Types.ObjectId, status: number): Promise<Order[]> {
    return await this.Order.find({ restaurant_id: id, status }).sort({ created_at: 1 }).exec();
  }

  async deleteOrder(_id: Types.ObjectId) {
    const result = await this.Order.deleteOne({ _id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('해당 주문이 존재하지 않습니다.');
    }
    return { message: '주문이 삭제 되었습니다.' };
  }
}