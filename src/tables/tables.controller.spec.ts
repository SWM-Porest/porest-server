import { Test, TestingModule } from '@nestjs/testing';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

jest.mock('./tables.service');

describe('TablesController', () => {
  let controller: TablesController;
  let service: TablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [TablesService],
    }).compile();

    controller = module.get<TablesController>(TablesController);
    service = module.get<TablesService>(TablesService);
  });

  it('GET /tables', () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);
    const received = controller.findAll();
    expect(received).resolves.toEqual([]);
  });
});
