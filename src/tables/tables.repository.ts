import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from './schema/table.schema';
import { Model } from 'mongoose';

@Injectable()
export class TablesRepository {
  constructor(@InjectModel(Table.name) private readonly tableModel: Model<Table>) {}

  async findAll(): Promise<Table[]> {
    return await this.tableModel.find().exec();
  }
}
