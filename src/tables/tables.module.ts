import { Module } from '@nestjs/common';
import { TablesService as TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from './schema/table.schema';
import { TablesRepository } from './tables.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }])],
  providers: [TablesService, TablesRepository],
  controllers: [TablesController],
})
export class TablesModule {}
