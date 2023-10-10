import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WaitingsService } from './waitings.service';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { UpdateWaitingDto } from './dto/update-waiting.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('waitings')
@ApiTags('Waiting API')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WaitingsController {
  constructor(private readonly waitingsService: WaitingsService) {}

  @ApiOperation({
    summary: '대기열 등록',
    description: '대기 정보를 등록하는 API입니다. Headers = Authorization: Bearer ${access_token}',
  })
  @Roles(UserRole.USER)
  @Post()
  async create(@Req() req: any, @Body() createWaitingDto: CreateWaitingDto) {
    return await this.waitingsService.create(createWaitingDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.waitingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waitingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaitingDto: UpdateWaitingDto) {
    return this.waitingsService.update(+id, updateWaitingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waitingsService.remove(+id);
  }
}
