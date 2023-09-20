import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Menu, Restaurant } from './schemas/restaurants.schema';
import { Types } from 'mongoose';

jest.mock('./restaurants.service');

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;
  const restaurant = new Restaurant();
  restaurant._id = new Types.ObjectId('64f5924a7b34ea507fdce827');
  restaurant.name = 'test';
  restaurant.address = 'test';
  restaurant.phone_number = 'test';
  restaurant.category = ['test'];
  restaurant.intro = 'test';
  restaurant.notice = 'test';
  restaurant.banner_images = [];
  restaurant.en_name = 'test';
  restaurant.status = 1;
  restaurant.menus = [];

  const dtoToSchema = (dto: CreateRestaurantsDto): Restaurant => {
    const restaurant = new Restaurant();
    restaurant._id = dto._id;
    restaurant.name = dto.name;
    restaurant.address = dto.address;
    restaurant.phone_number = dto.phone_number;
    restaurant.category = dto.category;
    restaurant.intro = dto.intro;
    restaurant.notice = dto.notice;
    restaurant.banner_images = dto.banner_images;
    restaurant.en_name = dto.en_name;
    restaurant.status = dto.status;
    restaurant.menus = dto.menus;
    return restaurant;
  };

  const RestaurantDtoStub = {
    _id: undefined,
    name: 'test',
    address: 'test',
    phone_number: 'test',
    category: ['test'],
    intro: 'test',
    notice: 'test',
    banner_images: [],
    created_at: undefined,
    en_name: undefined,
    updated_at: undefined,
    status: undefined,
    menus: [],
    toSchema: () => {
      const restaurant = new Restaurant();
      restaurant._id = RestaurantDtoStub._id;
      restaurant.name = RestaurantDtoStub.name;
      restaurant.address = RestaurantDtoStub.address;
      restaurant.phone_number = RestaurantDtoStub.phone_number;
      restaurant.category = RestaurantDtoStub.category;
      restaurant.intro = RestaurantDtoStub.intro;
      restaurant.notice = RestaurantDtoStub.notice;
      restaurant.banner_images = RestaurantDtoStub.banner_images;
      restaurant.en_name = RestaurantDtoStub.en_name;
      restaurant.status = RestaurantDtoStub.status;
      restaurant.menus = RestaurantDtoStub.menus;
      return restaurant;
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [RestaurantsService],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
    jest.clearAllMocks();
  });

  describe('POST /restaurants', () => {
    it('create restaurant', async () => {
      jest.spyOn(service, 'createRestaurant').mockImplementation(() => Promise.resolve(restaurant));
      const received = await controller.createRestaurant(
        {
          createRestaurantsDto: JSON.stringify(RestaurantDtoStub),
        },
        undefined,
      );

      expect(received).toBe(restaurant);
    });

    it('should return RestaurantAlreadyExists (Bad Request - 400) exception', async () => {
      jest
        .spyOn(service, 'createRestaurant')
        .mockRejectedValue(new HttpException('Name is Duplicated', HttpStatus.CONFLICT));

      await expect(
        controller.createRestaurant(
          {
            createRestaurantsDto: JSON.stringify(RestaurantDtoStub),
          },
          undefined,
        ),
      ).rejects.toThrow(new HttpException('Name is Duplicated', HttpStatus.CONFLICT));
    });
  });

  describe('GET /restaurants', () => {
    it('fetch restaurants', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve([]));
      const received = await controller.findAll();

      expect(received).toEqual([]);
    });
  });

  describe('GET /restaurants/:id', () => {
    it('fetch restaurant', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(restaurant));
      const received = await controller.findOneRestaurant('64f5924a7b34ea507fdce827');

      expect(received._id).toBe(restaurant._id);
    });
  });

  describe('PATCH /restaurants/:id', () => {
    it('update restaurant', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(dtoToSchema(RestaurantDtoStub)));
      const received = await controller.updateRestaurant(
        restaurant._id.toString(),
        {
          updateRestaurantsDto: JSON.stringify(dtoToSchema(RestaurantDtoStub)),
        },
        undefined,
      );

      expect(received).toEqual(dtoToSchema(RestaurantDtoStub));
    });
  });

  describe('POST /restaurants/:id/menus', () => {
    const menuDto = {
      _id: undefined,
      name: 'test',
      en_name: 'test',
      category: 'test',
      menutype: 'test',
      description: 'test',
      img: undefined,
      price: 1000,
      isSoldOut: false,
      menuOptions: [],
      ToSchema: () => {
        const menu = new Menu();
        menu._id = menuDto._id;
        menu.name = menuDto.name;
        menu.en_name = menuDto.en_name;
        menu.category = menuDto.category;
        menu.menutype = menuDto.menutype;
        menu.description = menuDto.description;
        menu.img = menuDto.img;
        menu.price = menuDto.price;
        menu.isSoldOut = menuDto.isSoldOut;
        menu.menuOptions = menuDto.menuOptions;
        return menu;
      },
    };

    it('add menu', async () => {
      restaurant.menus = [menuDto.ToSchema()];
      jest.spyOn(service, 'addMenu').mockImplementation(() => Promise.resolve(restaurant));
      const received = await controller.addMenu(
        restaurant._id.toString(),
        {
          createMenusDto: JSON.stringify(menuDto),
        },
        undefined,
      );

      expect(received).toEqual(restaurant);
    });
  });
  describe('PATCH /restaurants/:id/menus/:id', () => {
    it('update menu', async () => {
      const menuDto = {
        _id: undefined,
        name: 'test',
        en_name: 'test',
        category: 'test',
        menutype: 'test',
        description: 'test',
        img: undefined,
        price: 1000,
        isSoldOut: false,
        menuOptions: [],
        toSchema: () => {
          const menu = new Menu();
          menu._id = menuDto._id;
          menu.name = menuDto.name;
          menu.en_name = menuDto.en_name;
          menu.category = menuDto.category;
          menu.menutype = menuDto.menutype;
          menu.description = menuDto.description;
          menu.img = menuDto.img;
          menu.price = menuDto.price;
          menu.isSoldOut = menuDto.isSoldOut;
          menu.menuOptions = menuDto.menuOptions;
          return menu;
        },
      };

      restaurant.menus.push(menuDto.toSchema());
      jest.spyOn(service, 'updateMenu').mockImplementation(() => Promise.resolve(restaurant));
      const received = await controller.updateMenu(
        restaurant._id.toString(),
        {
          updateMenusDto: JSON.stringify(menuDto),
        },
        undefined,
      );

      expect(received).toEqual(restaurant);
    });
  });

  describe('DELETE /restaurants/:id/menus/:id', () => {
    const copy_restaurant = { ...restaurant, menus: [...restaurant.menus] };
    const menuDto = {
      _id: '64f5924a7b34ea507fdce827',
      name: 'test',
      en_name: 'test',
      category: 'test',
      menutype: 'test',
      description: 'test',
      img: undefined,
      price: 1000,
      isSoldOut: false,
      menuOptions: [],
      toSchema: () => {
        const menu = new Menu();
        menu._id = new Types.ObjectId(menuDto._id);
        menu.name = menuDto.name;
        menu.en_name = menuDto.en_name;
        menu.category = menuDto.category;
        menu.menutype = menuDto.menutype;
        menu.description = menuDto.description;
        menu.img = menuDto.img;
        menu.price = menuDto.price;
        menu.isSoldOut = menuDto.isSoldOut;
        menu.menuOptions = menuDto.menuOptions;
        return menu;
      },
    };
    restaurant.menus.push(menuDto.toSchema());

    it('delete menu', async () => {
      jest.spyOn(service, 'deleteMenu').mockImplementation(() => Promise.resolve(copy_restaurant));
      const received = await controller.deleteMenu(restaurant._id.toString(), menuDto._id);

      expect(received).toEqual(copy_restaurant);
    });
  });
});
