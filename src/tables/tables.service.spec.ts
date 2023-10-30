import { Test, TestingModule } from '@nestjs/testing';
import { TablesService as TablesService } from './tables.service';
import { TablesRepository } from './tables.repository';
import { Types } from 'mongoose';
import { Table } from './schema/table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

jest.mock('./tables.repository');

describe('TablesService', () => {
  let service: TablesService;
  let repository: TablesRepository;
  const mockTable: Table = {
    restaurant_id: new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7b'),
    name: 'Table 1',
    order_ids: [new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7c')],
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TablesService, TablesRepository],
    }).compile();

    service = module.get<TablesService>(TablesService);
    repository = module.get<TablesRepository>(TablesRepository);
  });

  it('findAllTables', () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([]);
    const received = service.findAll();
    expect(received).resolves.toEqual([]);
  });

  it('findOneTable', () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockTable);
    const received = service.findOne('5f8fde4b7b750d1d1c0b4c7a');
    expect(received).resolves.toEqual(mockTable);
  });

  // it('createTable', () => {
  //   const mockCreateTableDto: CreateTableDto = {
  //     _id: undefined,
  //     restaurant_id: new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7b'),
  //     name: 'Table 1',
  //     order_ids: [new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7c')],
  //     created_at: undefined,
  //     updated_at: undefined,
  //   };
  //   jest.spyOn(repository, 'createTable').mockResolvedValue(mockTable);
  //   const received = service.createTable(mockCreateTableDto);
  //   expect(received).resolves.toEqual(mockTable);
  // });

  it('addOrder', () => {
    mockTable.order_ids.push(new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7c'));

    jest.spyOn(repository, 'addOrder').mockResolvedValue(mockTable);
    const received = service.addOrder('5f8fde4b7b750d1d1c0b4c7a', '5f8fde4b7b750d1d1c0b4c7c');

    expect(received).resolves.toEqual(mockTable);
  });

  // it('updateTable', () => {
  //   const mockUpdateTableDto: UpdateTableDto = {
  //     _id: new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7a'),
  //     restaurant_id: new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7b'),
  //     name: 'Table 2',
  //     order_ids: [new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7c')],
  //     created_at: undefined,
  //     updated_at: undefined,
  //   };

  //   const updateMockTable: Table = {
  //     _id: new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7a'),
  //     restaurant_id: new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7b'),
  //     name: 'Table 2',
  //     order_ids: [new Types.ObjectId('5f8fde4b7b750d1d1c0b4c7c')],
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   };

  //   jest.spyOn(repository, 'updateTable').mockResolvedValue(updateMockTable);
  //   const received = service.updateTable('5f8fde4b7b750d1d1c0b4c7a', mockUpdateTableDto);
  //   expect(received).resolves.toEqual(updateMockTable);
  // });

  it('deleteTable', () => {
    jest.spyOn(repository, 'deleteTable').mockResolvedValue(mockTable);
    const received = service.deleteTable('5f8fde4b7b750d1d1c0b4c7a');
    expect(received).resolves.toEqual(mockTable);
  });
});
