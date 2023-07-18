import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue('Find All Restaurants'),
          },
        },
      ],
    }).compile();

    controller = app.get<RestaurantsController>(RestaurantsController);
    service = app.get<RestaurantsService>(RestaurantsService);
  });

  describe('/', () => {
    it('should return "Find All Restaurants"', async () => {
      expect(controller.findAll()).resolves.toBe('Find All Restaurants');
    });
  });
});
