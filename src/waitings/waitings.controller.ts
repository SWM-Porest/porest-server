import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { WaitingsService } from './waitings.service';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Waiting, WaitingStatus } from './schemas/waiting.schema';
import { ReadWaitingDto } from './dto/read-waiting.dto';

@Controller('waitings')
@ApiTags('Waiting API')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WaitingsController {
  constructor(private readonly waitingsService: WaitingsService) {}

  @ApiOperation({
    summary: '대기열 등록',
    description: '대기 정보를 등록하는 API입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '대기열 등록 성공',
    type: Waiting,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.USER)
  @Post()
  async create(@Req() req: any, @Body() createWaitingDto: CreateWaitingDto) {
    return await this.waitingsService.create(createWaitingDto, req.user.userId);
  }

  @ApiOperation({
    summary: '매장 대기열 조회',
    description: '매장의 대기 중인 고객 리스트를 조회하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '매장 대기열 조회 성공',
    type: Waiting,
    isArray: true,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Get('restaurant/:restaurantId')
  async findActiveWaitings(@Param('restaurantId') restaurantId: string): Promise<Waiting[]> {
    // 앞에 남은 대기인원 수도 같이 보내주기
    // 대기중, 호출중인 대기자만 보내주기 순서는 호출중 > 대기중
    const waitingList: Waiting[] = await this.waitingsService.findAllWaitingList(restaurantId);
    return waitingList;
  }

  @ApiOperation({
    summary: '고객 대기열 조회',
    description: '고객의 대기 정보를 조회하는 API입니다. 본인의 대기 정보만 확인 가능.',
  })
  @ApiResponse({
    status: 200,
    description: '대기열 조회 성공',
    type: Waiting,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.USER)
  @Get(':restaurantId')
  async findOne(@Req() req: any, @Param('restaurantId') restaurantId: string) {
    // 앞에 남은 대기인원 수도 같이 보내주기
    return await this.waitingsService.findUniqueActive(req.user.userId, restaurantId, WaitingStatus.SEATED);
  }

  @ApiOperation({
    summary: '고객 대기열 취소',
    description: '본인의 대기 정보를 삭제하는 API입니다. 본인의 대기 정보만 삭제 가능.',
  })
  @ApiResponse({
    status: 200,
    description: '대기열 취소 성공',
    type: Waiting,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.USER)
  @Patch('cancel')
  async cancelOwnWaiting(@Req() req: any, @Body() readWaitingDto: ReadWaitingDto) {
    const waiting: Waiting = await this.waitingsService.findOneActive(readWaitingDto._id, WaitingStatus.SEATED);
    return await this.waitingsService.cancelOwnWaiting(waiting, req.user);
  }

  @ApiOperation({
    summary: '매장 대기열 취소',
    description: '매장의 대기 정보를 삭제하는 API입니다. 본인 매장의 대기 정보만 삭제 가능.',
  })
  @ApiResponse({
    status: 200,
    description: '대기열 취소 성공',
    type: Waiting,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.USER)
  @Patch('managercancel')
  async cancelWaiting(@Req() req: any, @Body() readWaitingDto: ReadWaitingDto) {
    const waiting: Waiting = await this.waitingsService.findOneActive(readWaitingDto._id, WaitingStatus.SEATED);
    await this.waitingsService.validateRestaurant(waiting.restaurant_id, req.user.restaurantsId);
    return await this.waitingsService.cancelWaiting(waiting, req.user.userNick);
  }

  @ApiOperation({
    summary: '대기열 호출',
    description: '대기자를 호출하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '대기열 호출 성공',
    type: Waiting,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch('call')
  async callWaiting(@Req() req: any, @Body() ReadWaitingDto: ReadWaitingDto) {
    return await this.waitingsService.callWaiting(ReadWaitingDto._id, req.user.restaurantsId);
  }
}
