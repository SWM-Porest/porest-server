import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';

@Injectable()
export class OrdersRepository {
  constructor(@InjectModel('Orders') private readonly Order: Model<Order>) {}

  async createOrder(createOrdersDto: CreateOrdersDto) {
    return await this.Order.create(createOrdersDto);
  }

  async updateOrder(updateOrdersDto: UpdateOrdersDto, id: Types.ObjectId) {
    return await this.Order.updateOne({ _id: id }, updateOrdersDto);
  }

  async getOrder(id: string) {
    const _id = new Types.ObjectId(id);
    const order = await this.Order.findById(_id).exec();
    if (order) {
      return order;
    }
    throw new NotFoundException('해당 주문이 존재하지 않습니다.');
  }

  async getOrdersByUser(
    id: Types.ObjectId,
    page: number,
    pageSize: number,
    sort: number,
  ): Promise<Order[] | undefined> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    return await this.Order.find({ user_id: id })
      .sort({ created_at: sort ? 1 : -1 })
      .skip(startIndex)
      .limit(endIndex)
      .exec();
  }

  async getOrdersByRestaurant(id: Types.ObjectId, status: number): Promise<Order[] | undefined> {
    return await this.Order.find({ restaurant_id: id, status }).sort({ created_at: 1 }).exec();
  }

  async deleteOrder(objectId: Types.ObjectId) {
    return await this.Order.deleteOne({ _id: objectId });
  }
}
