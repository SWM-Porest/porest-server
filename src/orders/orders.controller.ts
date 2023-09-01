import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@ApiTags('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiForbiddenResponse({
    status: 403,
    description: '주문 권한이 없습니다.',
  })
  @Roles(UserRole.USER)
  @Post()
  async createOrder(@Body() createOrdersDto: CreateOrdersDto) {
    const data = await this.ordersService.createOrder(createOrdersDto);
    return data;
  }

  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch()
  async updateOrder(@Body() updateOrdersDto: UpdateOrdersDto) {
    return await this.ordersService.updateOrder(updateOrdersDto);
  }

  @Roles(UserRole.RESTAURANT_MANAGER)
  @Delete('/delete')
  async deleteOrder() {
    return await this.ordersService.deleteOrder();
  }

  @Roles(UserRole.USER)
  @Get('/:id')
  async getOrder(@Param('id') id: string) {
    try {
      return await this.ordersService.getOrder(id);
    } catch (err) {
      return err.response;
    }
  }

  @Roles(UserRole.USER)
  @Get('/user/:id')
  async getOrdersByUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('sort', ParseIntPipe) sort = 0,
  ) {
    return await this.ordersService.getOrdersByUser(id, page, pageSize, sort);
  }

  @Roles(UserRole.RESTAURANT_MANAGER)
  @Get('/restaurant/:id')
  async getOrdersByRestaurant(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('status', ParseIntPipe) status: number,
  ) {
    return await this.ordersService.getOrdersByRestaurant(id, status);
  }
}
