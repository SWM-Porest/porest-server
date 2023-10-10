import { Test, TestingModule } from '@nestjs/testing';
import { WaitingsController } from './waitings.controller';
import { WaitingsService } from './waitings.service';
import { Waiting } from './schemas/waiting.schema';
import { Types } from 'mongoose';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { UsersService } from 'src/auth/user.service';
import { AuthService } from 'src/auth/auth.service';
import { WaitingsRepository } from './waitings.repository';

jest.mock('./waitings.service');

describe('WaitingsController', () => {
  let controller: WaitingsController;
  let service: WaitingsService;

  const userId = '60f0f1b0f1b1f1b1f1b1f1b3';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingsController],
      providers: [
        WaitingsService,
        {
          provide: RestaurantsService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: WaitingsRepository,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<WaitingsController>(WaitingsController);
    service = module.get<WaitingsService>(WaitingsService);
    jest.clearAllMocks();
  });

  describe('create waiting', () => {
    const createWaitingDto: CreateWaitingDto = {
      restaurant_id: '60f0f1b0f1b1f1b1f1b1f1b2',
      head_count: 2,
    };
    const req = {
      user: {
        userId: userId,
      },
    };
    it('should create a waiting', async () => {
      const waiting: Waiting = {
        _id: new Types.ObjectId('60f0f1b0f1b1f1b1f1b1f1b1'),
        restaurant_id: '60f0f1b0f1b1f1b1f1b1f1b2',
        user_id: '60f0f1b0f1b1f1b1f1b1f1b3',
        restaurant_name: 'test',
        head_count: 2,
        canceled_by: '',
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await controller.create(req, createWaitingDto);
      expect(result).toEqual(waiting);
      expect(service.create).toHaveBeenCalledWith(createWaitingDto, req.user.userId);
    });
  });
});
