import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from './schema/table.schema';
import { Model, Types } from 'mongoose';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesRepository {
  constructor(@InjectModel(Table.name) private readonly tableModel: Model<Table>) {}

  async findAll(): Promise<Table[]> {
    return await this.tableModel.find().exec();
  }

  async findOne(_id: string): Promise<Table> {
    return await this.tableModel.findById(_id).exec();
  }

  async addOrder(_id: string, order_id: string): Promise<Table> {
    return await this.tableModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(_id) },
      { $push: { order_ids: new Types.ObjectId(order_id) } },
      { new: true },
    );
  }

  async createTable(createTableDto: CreateTableDto): Promise<Table> {
    return await this.tableModel.create(createTableDto);
  }

  async updateTable(_id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    return await this.tableModel.findByIdAndUpdate({ _id: new Types.ObjectId(_id) }, updateTableDto, { new: true });
  }

  async deleteTable(_id: string): Promise<Table> {
    return await this.tableModel.findByIdAndDelete(new Types.ObjectId(_id));
  }
}
