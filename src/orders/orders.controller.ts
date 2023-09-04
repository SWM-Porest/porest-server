import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Order } from './schemas/orders.schema';

@Controller('orders')
@ApiTags('주문 API')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: '주문 생성',
    description: '주문을 생성하는 API입니다. Headers = Authorization: Bearer ${token} ',
  })
  @ApiCreatedResponse({ description: '주문 생성 성공', type: Order })
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

  @ApiOperation({
    summary: '주문 수정',
    description:
      '주문을 수정하는 API입니다. 점주는 주문을 수정할 수 있습니다. 고객은 수정이 불가함. Headers = Authorization: Bearer ${token} ',
  })
  @ApiCreatedResponse({ description: '주문 수정 성공', type: Order })
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch('/:id')
  async updateOrder(@Body() updateOrdersDto: UpdateOrdersDto, @Param('id') id: string) {
    const objectId = new Types.ObjectId(id);
    return await this.ordersService.updateOrder(updateOrdersDto, objectId);
  }

  @Roles(UserRole.RESTAURANT_MANAGER)
  @Delete('/delete')
  async deleteOrder() {
    return await this.ordersService.deleteOrder();
  }

  @ApiOperation({ summary: '고객 주문 상태 조회', description: '주문을 조회하는 API입니다.' })
  @Roles(UserRole.USER)
  @Get('/:id')
  async getOrder(@Param('id') id: string, @Req() req: any) {
    await this.ordersService.validateUser(new Types.ObjectId(id), new Types.ObjectId(req.user._id));
    try {
      return await this.ordersService.getOrder(id);
    } catch (err) {
      return err.response;
    }
  }

  @ApiOperation({ summary: '고객 주문내역 조회', description: '고객의 주문내역을 조회하는 API입니다.' })
  @Roles(UserRole.USER)
  @Get('/user/:id')
  async getOrdersByUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('sort', ParseIntPipe) sort = 0,
    @Req() req: any,
  ) {
    await this.ordersService.validateUser(new Types.ObjectId(id), new Types.ObjectId(req.user._id));
    return await this.ordersService.getOrdersByUser(id, page, pageSize, sort);
  }

  @ApiOperation({ summary: '매장 주문내역 조회', description: '매장의 주문내역을 조회하는 API입니다.' })
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Get('/restaurant/:id')
  async getOrdersByRestaurant(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('status', ParseIntPipe) status: number,
  ) {
    return await this.ordersService.getOrdersByRestaurant(id, status);
  }
}
