import { Test, TestingModule } from '@nestjs/testing';
import { WaitingsService } from './waitings.service';
import { WaitingsRepository } from './waitings.repository';
import { RestaurantsService } from 'src/restaurants/restaurants.service';

describe('WaitingsService', () => {
  let service: WaitingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingsService, WaitingsRepository, RestaurantsService],
    }).compile();

    service = module.get<WaitingsService>(WaitingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
