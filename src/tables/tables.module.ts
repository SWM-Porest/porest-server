import { Module } from '@nestjs/common';
import { TablesService as TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from './schema/table.schema';
import { TablesRepository } from './tables.repository';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/auth/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]), AuthModule],
  providers: [TablesService, TablesRepository, AuthService, UsersService],
  controllers: [TablesController],
})
export class TablesModule {}
