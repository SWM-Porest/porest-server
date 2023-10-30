import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Table } from './schema/table.schema';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/auth/schemas/user.schema';

@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TablesController {
  constructor(private readonly tableService: TablesService) {}

  @ApiOperation({ summary: '테이블 전체 조회' })
  @Get()
  async findAll(): Promise<Table[]> {
    return await this.tableService.findAll();
  }

  @ApiOperation({ summary: '테이블 조회' })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Get(':id')
  async findOne(@Param() _id: string): Promise<Table> {
    return await this.tableService.findOne(_id);
  }

  @ApiOperation({ summary: '매장별 테이블 조회' })
  @Get('/restaurants/:restaurant_id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  async findByRestaurantID(@Param('restaurant_id') restaurant_id: string): Promise<Table[]> {
    return await this.tableService.findByRestaurantID(restaurant_id);
  }

  @ApiOperation({ summary: '테이블 생성' })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Post()
  async createTable(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return await this.tableService.createTable(createTableDto);
  }

  @ApiOperation({ summary: '테이블 수정' })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch(':id')
  async updateTable(@Param() _id: string, @Body() updateTableDto: UpdateTableDto): Promise<Table> {
    return await this.tableService.updateTable(_id, updateTableDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  async deleteTable(@Param() _id: string): Promise<Table> {
    return await this.tableService.deleteTable(_id);
  }
}
