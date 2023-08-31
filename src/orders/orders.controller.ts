import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrdersDto: CreateOrdersDto) {
    const data = await this.ordersService.createOrder(createOrdersDto);
    return data;
  }

  @Patch()
  async updateOrder(@Body() updateOrdersDto: UpdateOrdersDto) {
    return await this.ordersService.updateOrder(updateOrdersDto);
  }

  @Delete('/delete')
  async deleteOrder() {
    return await this.ordersService.deleteOrder();
  }

  @Get('/:id')
  async getOrder(@Param('id') id: string) {
    try {
      return await this.ordersService.getOrder(id);
    } catch (err) {
      return err.response;
    }
  }

  @Get('/user/:id')
  async getOrdersByUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('sort', ParseIntPipe) sort = 0,
  ) {
    return await this.ordersService.getOrdersByUser(id, page, pageSize, sort);
  }

  @Get('/restaurant/:id')
  async getOrdersByRestaurant(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('status', ParseIntPipe) status: number,
  ) {
    return await this.ordersService.getOrdersByRestaurant(id, status);
  }
}
