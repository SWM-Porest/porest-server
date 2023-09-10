import { Injectable } from '@nestjs/common';
import { Table } from './schema/table.schema';
import { TablesRepository } from './tables.repository';

@Injectable()
export class TablesService {
  constructor(private readonly tableRespository: TablesRepository) {}
  async findAll(): Promise<Table[]> {
    return await this.tableRespository.findAll();
  }
}
