import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Table } from './schema/table.schema';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('tables')
export class TablesController {
  constructor(private readonly tableService: TablesService) {}

  @ApiOperation({ summary: '테이블 전체 조회' })
  @Get()
  async findAll(): Promise<Table[]> {
    return await this.tableService.findAll();
  }

  @ApiOperation({ summary: '테이블 조회' })
  @Get(':id')
  async findOne(@Param() _id: string): Promise<Table> {
    return await this.tableService.findOne(_id);
  }

  @ApiOperation({ summary: '테이블 생성' })
  @Post()
  async createTable(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return await this.tableService.createTable(createTableDto);
  }

  @ApiOperation({ summary: '테이블 수정' })
  @Patch(':id')
  async updateTable(@Param() _id: string, @Body() updateTableDto: UpdateTableDto): Promise<Table> {
    return await this.tableService.updateTable(_id, updateTableDto);
  }

  @Delete(':id')
  async deleteTable(@Param() _id: string): Promise<Table> {
    return await this.tableService.deleteTable(_id);
  }
}
