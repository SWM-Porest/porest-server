import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Order } from './schemas/orders.schema';
import { GetOrdersByUserDto } from './dto/getOrdersByUser.dto';
import { sendNotification } from 'web-push';
import { OrderStatusMessage, PushSubscriptionDto } from './dto/pushSubscription.dto';

@Controller('orders')
@ApiTags('주문 API')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: '주문 생성',
    description: '주문을 생성하는 API입니다. Headers = Authorization: Bearer ${access_token}',
  })
  @ApiCreatedResponse({ description: '주문 생성 성공', type: Order })
  @ApiForbiddenResponse({
    status: 403,
    description: '주문 권한이 없습니다.',
  })
  @Roles(UserRole.USER)
  @Post()
  async createOrder(@Body() createOrdersDto: CreateOrdersDto, @Req() req: any): Promise<Order> {
    createOrdersDto.user_id = req.user.userId;
    const token = createOrdersDto?.token;
    const data = await this.ordersService.createOrder(createOrdersDto);
    if (token) {
      await this.ordersService.notifyOrder(token, {
        title: `주문이 접수 되었습니다.`,
        body: '매장에서 주문확인 중입니다.',
      });
    }
    return data;
  }

  @ApiOperation({
    summary: '주문 수정',
    description:
      '주문을 수정하는 API입니다. 점주는 주문을 수정할 수 있습니다. 고객은 수정이 불가함. Headers = Authorization: Bearer ${token} ',
  })
  @ApiCreatedResponse({ description: '주문 수정 성공', type: Order })
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch()
  async updateOrder(@Req() req: any, @Body() updateOrdersDto: UpdateOrdersDto): Promise<Order> {
    const order = await this.ordersService.getOrder(new Types.ObjectId(updateOrdersDto._id));
    await this.ordersService.validateRestaurant(order.restaurant_id, req.user.restaurantsId); // 해당 주문의 매장 관리 권한 확인

    const updatedOrder = await this.ordersService.updateOrder(updateOrdersDto);

    // 주문 상태가 변경되었을 때, 푸시 알림 전송
    if (updateOrdersDto?.status && updatedOrder?.token) {
      await this.ordersService.notifyOrder(updatedOrder.token, {
        title: `주문의 상태가 변경되었습니다.`,
        body: `${updateOrdersDto.status as OrderStatusMessage}`,
      });
    }
    return updatedOrder;
  }

  // test code 필요
  @ApiOperation({
    summary: '주문 상태 수정',
    description: '주문 상태를 수정하는 API입니다. 점주는 주문 상태를 수정할 수 있습니다. 고객은 수정이 불가함. ',
  })
  @ApiCreatedResponse({
    description: '주문 상태 수정',
    type: Order,
  })
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch(':id')
  async updateOrderStatus(@Param('id') id: string, @Query('s') s: number): Promise<Order> {
    const objectId = new Types.ObjectId(id);
    const order: Order = await this.ordersService.updateOrderStatus(objectId, s);
    const token = order?.token;
    if (token) {
      await this.ordersService.notifyOrder(token, {
        title: `주문의 상태가 변경되었습니다.`,
        body: `${OrderStatusMessage[s]}`,
      });
    }
    return order;
  }

  @ApiOperation({ summary: '주문 삭제', description: '주문을 삭제하는 API입니다.' })
  @ApiCreatedResponse({ description: '주문 삭제 성공' })
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Delete('/delete/:id')
  async deleteOrder(@Param('id') id: string) {
    const objectId = new Types.ObjectId(id);
    return await this.ordersService.deleteOrder(objectId);
  }

  @ApiOperation({
    summary: '고객 주문내역 조회',
    description: '고객의 주문내역을 조회하는 API입니다. 본인의 주문내역만 확인 가능합니다.',
  })
  @ApiQuery({ name: 'page', required: true, description: '페이지 번호' })
  @ApiQuery({ name: 'pageSize', required: true, description: '페이지당 주문 수' })
  @ApiQuery({ name: 'sort', required: true, description: '정렬 방식 (0: 최신순, 1: 오래된순)' })
  @Roles(UserRole.USER)
  @Get('/user')
  async getOrdersByUser(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sort', ParseIntPipe) sort: number,
    @Req() req: any,
  ): Promise<GetOrdersByUserDto> {
    return await this.ordersService.getOrdersByUser(req.user.userId, page, pageSize, sort);
  }

  @ApiOperation({ summary: '매장 주문내역 상태별 조회', description: '매장의 주문내역을 상태별 조회하는 API입니다.' })
  @ApiQuery({
    name: 'status',
    required: true,
    description: '주문 상태 (0: 주문 취소, 1: 주문완료, 2: 조리중, 3: 조리완료, 4: 서빙완료, 5: 결제완료)',
  })
  @Get('/restaurant/:id')
  async getOrdersByRestaurant(
    @Req() req: any,
    @Param('id') id: string,
    @Query('status') status: number | null = null,
  ): Promise<Order[]> {
    // await this.ordersService.validateRestaurant(req.user.userId, [id]);
    return await this.ordersService.getRestauarntOrdersByDate(id, status);
  }

  @Post('testNotify')
  async testNotify(@Body() Body: PushSubscriptionDto) {
    const payload = JSON.stringify({
      title: `테스트용 푸시 알림입니다.`,
      Body: '테스트용 푸시 알림입니다.',
      tag: '테스트용 푸시 알림입니다.',
      requireInteraction: true,
    });
    try {
      await sendNotification(Body, payload);
    } catch (err) {
      console.log(err);
    }
  }

  @ApiOperation({ summary: '고객 주문 상태 조회', description: '주문을 조회하는 API입니다.' })
  @ApiResponseProperty({ type: Order })
  @Get('/:id')
  async getOrder(@Param('id') id: string): Promise<Order> {
    try {
      return await this.ordersService.getOrder(new Types.ObjectId(id));
    } catch (err) {
      return err.response;
    }
  }
}
