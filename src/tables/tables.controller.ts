import { Controller, Get } from '@nestjs/common';
import { Table } from './schema/table.schema';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tableService: TablesService) {}

  @Get()
  async findAll(): Promise<Table[]> {
    return await this.tableService.findAll();
  }
}
