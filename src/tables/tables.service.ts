import { Injectable } from '@nestjs/common';
import { Table } from './schema/table.schema';
import { TablesRepository } from './tables.repository';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private readonly tableRespository: TablesRepository) {}

  async findAll(): Promise<Table[]> {
    return await this.tableRespository.findAll();
  }

  async findOne(_id: string): Promise<Table> {
    return await this.tableRespository.findOne(_id);
  }

  async createTable(createTableDto: CreateTableDto): Promise<Table> {
    return await this.tableRespository.createTable(createTableDto);
  }

  async addOrder(_id: string, order_id: string): Promise<Table> {
    return await this.tableRespository.addOrder(_id, order_id);
  }

  async updateTable(_id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    return await this.tableRespository.updateTable(_id, updateTableDto);
  }

  async deleteTable(_id: string): Promise<Table> {
    return await this.tableRespository.deleteTable(_id);
  }
}
