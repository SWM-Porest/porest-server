import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Order } from './schemas/orders.schema';
import { Types } from 'mongoose';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { UsersService } from 'src/auth/user.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateOrdersDto } from './dto/updateOrders.dto';
import { GetOrdersByUserDto } from './dto/getOrdersByUser.dto';

jest.mock('./orders.service');

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;
  const order = new Order();
  order._id = new Types.ObjectId('60b6d1b0b9b3b1b4e8b8b0b1');
  order.created_at = new Date('2023-01-01 00:00:00');
  order.menus = JSON.parse('{"menu_id": "value"}');
  order.restaurant_id = '60b6d1b0b9b3b1b4e8b8b0b2';
  order.restaurant_name = 'test';
  order.status = 1;
  order.table_id = 1;
  order.updated_at = new Date();
  order.user_id = '60b6d1b0b9b3b1b4e8b8b0b3';

  const dtoToSchema = (dto: CreateOrdersDto): Order => {
    const order = new Order();
    order._id = dto._id;
    order.restaurant_id = dto.restaurant_id;
    order.restaurant_name = dto.restaurant_name;
    order.user_id = dto.user_id;
    order.menus = dto.menus;
    order.status = dto.status;
    order.table_id = dto.table_id;
    return order;
  };

  const CreateOrdersDtoStub = (): CreateOrdersDto => {
    return {
      _id: undefined,
      restaurant_id: '',
      restaurant_name: 'test',
      restaurant_address: '',
      user_id: '',
      status: 1,
      status_updated_at: undefined,
      table_id: 1,
      menus: JSON.parse('{"menu_id": "value"}'),
    };
  };

  const UpdateOrdersDtoStub = (): UpdateOrdersDto => {
    return {
      _id: '60b6d1b0b9b3b1b4e8b8b0b1',
      menus: JSON.parse('{"menu_id": "value"}'),
      status: 1,
      status_updated_at: undefined,
    };
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: OrdersRepository,
          useValue: {},
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersController = new OrdersController(ordersService);
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('create order', async () => {
      jest.spyOn(ordersService, 'createOrder').mockImplementation(() => Promise.resolve(order));
      const request = {
        user: {
          userId: '60b6d1b0b9b3b1b4e8b8b0b3',
        },
      };
      const received = await ordersController.createOrder({ ...CreateOrdersDtoStub() }, request);

      expect(received).toBe(order);
    });
  });

  describe('PATCH /orders', () => {
    it('update order', async () => {
      jest.spyOn(ordersService, 'getOrder').mockResolvedValue(order);
      jest.spyOn(ordersService, 'updateOrder').mockImplementation(() => Promise.resolve(order));
      const request = {
        user: {
          userId: '60b6d1b0b9b3b1b4e8b8b0b3',
          restaurantsId: ['60b6d1b0b9b3b1b4e8b8b0b2'],
        },
      };
      const received = await ordersController.updateOrder(request, UpdateOrdersDtoStub());

      expect(received).toBe(order);
    });
  });

  describe('DELETE /orders', () => {
    it('delete order', async () => {
      jest
        .spyOn(ordersService, 'deleteOrder')
        .mockImplementation(() => Promise.resolve({ message: '주문이 삭제 되었습니다.' }));
      const received = await ordersController.deleteOrder('60b6d1b0b9b3b1b4e8b8b0b1');

      expect(received).toEqual({ message: '주문이 삭제 되었습니다.' });
    });
  });

  describe('GET /orders', () => {
    it('get orders By UserId', async () => {
      const getOrders: GetOrdersByUserDto = {
        orders: [order],
        page: 1,
        pageSize: 10,
        sort: 0,
      };
      jest.spyOn(ordersService, 'getOrdersByUser').mockImplementation(() => Promise.resolve(getOrders));
      const request = {
        user: {
          userId: '60b6d1b0b9b3b1b4e8b8b0b3',
          restaurantsId: ['60b6d1b0b9b3b1b4e8b8b0b2'],
        },
      };
      const received = await ordersController.getOrdersByUser(1, 10, 0, request);

      expect(received).toBe(getOrders);
    });
  });

  describe('GET /orders/restaurant/:id', () => {
    it('get orders By RestaurantId', async () => {
      const orders: Order[] = [order];
      jest.spyOn(ordersService, 'getOrdersByRestaurant').mockImplementation(() => Promise.resolve(orders));
      const request = {
        user: {
          userId: '60b6d1b0b9b3b1b4e8b8b0b3',
          restaurantsId: ['60b6d1b0b9b3b1b4e8b8b0b2'],
        },
      };
      const received = await ordersController.getOrdersByRestaurant(request, '60b6d1b0b9b3b1b4e8b8b0b2', 1);

      expect(received).toBe(orders);
    });
  });

  describe('GET /orders/:id', () => {
    it('get order By Id', async () => {
      jest.spyOn(ordersService, 'getOrder').mockImplementation(() => Promise.resolve(order));
      const received = await ordersController.getOrder('60b6d1b0b9b3b1b4e8b8b0b1');

      expect(received).toBe(order);
    });
  });
});
