import { Test } from '@nestjs/testing';
import { RestaurantRepository } from './restaurants.repository';
import { RestaurantsService } from './restaurants.service';
import { Menu, Restaurant } from './schemas/restaurants.schema';
import { ImageUploadService } from '../common/uploader/image-upload.service';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

jest.mock('./restaurants.repository');

describe('RestaurantService', () => {
  let service: RestaurantsService;
  let repository: RestaurantRepository;
  let imageUploadService: ImageUploadService;

  const restaurantDto = {
    _id: new Types.ObjectId('64f5924a7b34ea507fdce827'),
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
      restaurant._id = restaurantDto._id;
      restaurant.name = restaurantDto.name;
      restaurant.address = restaurantDto.address;
      restaurant.phone_number = restaurantDto.phone_number;
      restaurant.category = restaurantDto.category;
      restaurant.intro = restaurantDto.intro;
      restaurant.notice = restaurantDto.notice;
      restaurant.banner_images = restaurantDto.banner_images;
      restaurant.en_name = restaurantDto.en_name;
      restaurant.status = restaurantDto.status;
      restaurant.menus = restaurantDto.menus;
      return restaurant;
    },
  };

  const files: Express.Multer.File[] = [
    {
      fieldname: 'test',
      originalname: 'test',
      buffer: undefined,
      filename: 'test',
      mimetype: 'image/png',
      size: 1,
      stream: undefined,
      destination: undefined,
      path: undefined,
      encoding: undefined,
    },
  ];
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [RestaurantsService, RestaurantRepository, ImageUploadService],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    imageUploadService = module.get<ImageUploadService>(ImageUploadService);
    repository = module.get<RestaurantRepository>(RestaurantRepository);
  });

  beforeEach(() => {
    jest.spyOn(imageUploadService, 'uploadImage').mockImplementation((files) =>
      Promise.resolve([
        {
          filename: 'test',
          path: '/images/test',
          type: 'image/png',
        },
      ]),
    );

    jest.spyOn(repository, 'findOneRestaurant').mockImplementation((id) => Promise.resolve(restaurantDto));
  });

  describe('createRestaurant', () => {
    it('createRestaurant', async () => {
      jest.spyOn(repository, 'createRestaurant').mockImplementation(() => Promise.resolve(restaurantDto));
      const received = await service.createRestaurant(restaurantDto, files);
      expect(received).toBe(restaurantDto);
    });
  });

  describe('findAll', () => {
    it('findAll', async () => {
      jest.spyOn(repository, 'findAll').mockImplementation(() => Promise.resolve([restaurantDto]));
      const received = await service.findAll();
      expect(received).toEqual([restaurantDto]);
    });
  });

  describe('findOne', () => {
    it('findOne', async () => {
      jest.spyOn(repository, 'findOneRestaurant').mockImplementation((id) => Promise.resolve(restaurantDto));
      const received = await service.findOne(restaurantDto._id.toString());
      expect(received).toEqual(restaurantDto);
    });
  });

  describe('update', () => {
    it('update', async () => {
      const custom_files = {
        image: files,
        menuImage: files,
      };
      jest.spyOn(repository, 'updateRestaurant').mockImplementation((id, dto) => Promise.resolve(restaurantDto));
      const received = await service.update(restaurantDto._id.toString(), restaurantDto, custom_files);
      expect(received).toEqual(restaurantDto);
    });
  });

  describe('addMenu', () => {
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
      created_at: undefined,
      updated_at: undefined,
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
    it('addMenu', async () => {
      jest.spyOn(repository, 'addMenu').mockImplementation((id, dto) => Promise.resolve(restaurantDto));
      const received = await service.addMenu(restaurantDto._id.toString(), menuDto, files);
      expect(received).toEqual(restaurantDto);
    });
  });

  describe('updateMenu', () => {
    const menuDto = {
      _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
      name: 'test',
      en_name: 'test',
      category: 'test',
      menutype: 'test',
      description: 'test',
      img: undefined,
      price: 1000,
      isSoldOut: false,
      menuOptions: [],
      created_at: undefined,
      updated_at: undefined,
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
    it('updateMenu', async () => {
      jest.spyOn(repository, 'updateMenu').mockImplementation((id, dto) => Promise.resolve(restaurantDto));
      const received = await service.updateMenu(restaurantDto._id.toString(), menuDto, files);
      expect(received).toEqual(restaurantDto);
    });
  });

  describe('deleteMenu', () => {
    it('deleteMenu', async () => {
      jest.spyOn(repository, 'deleteMenu').mockImplementation((id, menuId) => Promise.resolve(restaurantDto));
      const received = await service.deleteMenu(restaurantDto._id.toString(), restaurantDto._id.toString());
      expect(received).toEqual(restaurantDto);
    });

    it('not found Restaurant', async () => {
      const menuDto = {
        _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
        name: 'test',
        en_name: 'test',
        category: 'test',
        menutype: 'test',
        description: 'test',
        img: undefined,
        price: 1000,
        isSoldOut: false,
        menuOptions: [],
        created_at: undefined,
        updated_at: undefined,
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
      jest.spyOn(repository, 'findOneRestaurant').mockImplementation((id) => Promise.resolve(undefined));

      expect(service.deleteMenu(restaurantDto._id.toString(), menuDto._id.toString())).rejects.toThrow(
        new NotFoundException(`Not exist ${restaurantDto._id.toString()}`),
      );
    });
  });

  describe('addMenuOption', () => {
    const menuDto = {
      _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
      name: 'test',
      en_name: 'test',
      category: 'test',
      menutype: 'test',
      description: 'test',
      img: undefined,
      price: 1000,
      isSoldOut: false,
      menuOptions: [],
      created_at: undefined,
      updated_at: undefined,
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
    const menuOptionDto = {
      _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
      name: {
        language: {
          ko: 'test',
          en: 'test',
        },
      },
      items: [],
      isSoldOut: false,
      maxSelect: 1,
      created_at: undefined,
      updated_at: undefined,
    };
    menuDto.menuOptions.push(menuOptionDto);
    const custom_restuarant = { ...restaurantDto };
    custom_restuarant.menus.push(menuDto);
    it('addMenuOption', async () => {
      jest
        .spyOn(repository, 'addMenuOption')
        .mockImplementation((id, menuId, dto) => Promise.resolve(custom_restuarant));
      const received = await service.addMenuOption(restaurantDto._id.toString(), menuDto._id.toString(), menuOptionDto);
      expect(received).toEqual(custom_restuarant);
    });
  });

  describe('updateMenuOption', () => {
    const menuDto = {
      _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
      name: 'test',
      en_name: 'test',
      category: 'test',
      menutype: 'test',
      description: 'test',
      img: undefined,
      price: 1000,
      isSoldOut: false,
      menuOptions: [],
      created_at: undefined,
      updated_at: undefined,
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
    const menuOptionDto = {
      _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
      name: {
        language: {
          ko: 'test',
          en: 'test',
        },
      },
      items: [],
      isSoldOut: false,
      maxSelect: 1,
      created_at: undefined,
      updated_at: undefined,
    };

    const custom_menuOptionDto = { ...menuOptionDto, name: { ...menuOptionDto.name } };
    custom_menuOptionDto.name.language.ko = 'test2';
    menuDto.menuOptions.push(custom_menuOptionDto);
    const custom_restuarant = { ...restaurantDto };
    custom_restuarant.menus.push(menuDto);
    it('updateMenuOption', async () => {
      jest
        .spyOn(repository, 'updateMenuOption')
        .mockImplementation((id, menuId, dto) => Promise.resolve(custom_restuarant));
      const received = await service.updateMenuOption(
        restaurantDto._id.toString(),
        menuDto._id.toString(),
        custom_menuOptionDto,
      );
      expect(received).toEqual(custom_restuarant);
    });
  });

  describe('deleteMenuOption', () => {
    const menuDto = {
      _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
      name: 'test',
      en_name: 'test',
      category: 'test',
      menutype: 'test',
      description: 'test',
      img: undefined,
      price: 1000,
      isSoldOut: false,
      menuOptions: [],
      created_at: undefined,
      updated_at: undefined,
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
    const menuOptionDto = {
      _id: new Types.ObjectId('64f5924a7b34ea507fdce828'),
      name: {
        language: {
          ko: 'test',
          en: 'test',
        },
      },
      items: [],
      isSoldOut: false,
      maxSelect: 1,
      created_at: undefined,
      updated_at: undefined,
    };

    it('deleteMenuOption', async () => {
      jest
        .spyOn(repository, 'deleteMenuOption')
        .mockImplementation((id, menuId, menuOptionId) => Promise.resolve(restaurantDto));
      const received = await service.deleteMenuOption(
        restaurantDto._id.toString(),
        menuDto._id.toString(),
        menuOptionDto._id.toString(),
      );
      expect(received).toEqual(restaurantDto);
    });
  });
});
