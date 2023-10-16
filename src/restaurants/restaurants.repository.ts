import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuOption, Restaurant } from './schemas/restaurants.schema';
import { Model, Types } from 'mongoose';
import { CreateMenuOptionsDto, CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateMenuOptionsDto, UpdateMenusDto, UpdateRestaurantsDto } from './dto/update-restaurants.dto';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
    @InjectModel(Menu.name) private readonly menuModel: Model<Menu>,
    @InjectModel(MenuOption.name) private readonly menuOptionModel: Model<MenuOption>,
  ) {}

  async createRestaurant(createRestaurantsDto: CreateRestaurantsDto): Promise<Restaurant> {
    const restaurant: CreateRestaurantsDto = new this.restaurantModel(createRestaurantsDto);
    restaurant._id = new Types.ObjectId();
    restaurant.menus = restaurant.menus.map((menu) => {
      if (!menu._id) {
        const m = new this.menuModel(menu);
        m._id = new Types.ObjectId();
        return m;
      } else {
        return menu;
      }
    });
    return await this.restaurantModel.create(restaurant);
  }

  async isExistRestaurant(name: string): Promise<boolean> {
    return (await this.restaurantModel.exists({ name })) ? true : false;
  }

  async updateRestaurant(_id: string, updateRestaurantsDto: UpdateRestaurantsDto): Promise<Restaurant> {
    const updateQuery: { [key: string]: any } = {
      $set: {
        name: { $cond: [{ $not: [!updateRestaurantsDto.name] }, updateRestaurantsDto.name, '$name'] },
        phone_number: {
          $cond: [{ $not: [!updateRestaurantsDto.phone_number] }, updateRestaurantsDto.phone_number, '$phone_number'],
        },
        intro: { $cond: [{ $not: [!updateRestaurantsDto.intro] }, updateRestaurantsDto.intro, '$intro'] },
        address: { $cond: [{ $not: [!updateRestaurantsDto.address] }, updateRestaurantsDto.address, '$address'] },
      },
    };

    return await this.restaurantModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, [updateQuery], { new: true });
  }

  async addRestaurantBannerImage(_id: string, updateRestaurantBannerImage: any): Promise<Restaurant> {
    return await this.restaurantModel.findOneAndUpdate(
      { _id: new Types.ObjectId(_id) },
      {
        $push: { banner_images: { $each: updateRestaurantBannerImage, $position: 0 } },
      },
      {
        new: true,
      },
    );
  }
  async deleteImage(_id: string, imageName: string): Promise<Restaurant> {
    // mongodb의 banner_images에서 filename이 imageName 과 같은 요소 삭제
    return await this.restaurantModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(_id) },
        { $pull: { banner_images: { filename: imageName } } },
        { new: true },
      )
      .exec();
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantModel.find().exec();
  }

  async findOneRestaurant(_id: string): Promise<Restaurant> {
    return await this.restaurantModel.findById(new Types.ObjectId(_id)).exec();
  }

  async addMenu(_id: string, createMenusDto: CreateMenusDto): Promise<Restaurant> {
    const menu: CreateMenusDto = new this.menuModel(createMenusDto);
    return await this.restaurantModel.findByIdAndUpdate(
      new Types.ObjectId(_id),
      { $push: { menus: menu } },
      { new: true },
    );
  }

  async updateMenu(_id: string, updateMenusDto: UpdateMenusDto): Promise<Restaurant> {
    if (updateMenusDto._id === undefined) {
      updateMenusDto.menuOptions.forEach((menuOption, index) => {
        if (menuOption._id === undefined) {
          const mo = new this.menuOptionModel(menuOption);
          mo._id = new Types.ObjectId();
          updateMenusDto.menuOptions[index] = mo;
        } else {
          updateMenusDto.menuOptions[index]._id = new Types.ObjectId(menuOption._id);
        }
      });

      const menu: CreateMenusDto = new this.menuModel(updateMenusDto);
      menu._id = new Types.ObjectId(menu._id);

      return await this.restaurantModel.findByIdAndUpdate(
        new Types.ObjectId(_id),
        { $push: { menus: menu } },
        { new: true },
      );
    } else {
      updateMenusDto._id = new Types.ObjectId(updateMenusDto._id);

      updateMenusDto.menuOptions.forEach((menuOption, index) => {
        if (menuOption._id === undefined) {
          menuOption._id = new Types.ObjectId();

          updateMenusDto.menuOptions[index] = menuOption;
        } else {
          updateMenusDto.menuOptions[index]._id = new Types.ObjectId(menuOption._id);
        }
      });

      return await this.restaurantModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(_id), 'menus._id': new Types.ObjectId(updateMenusDto._id) },
          { $set: { 'menus.$': updateMenusDto } },
          { new: true },
        )
        .exec();
    }
  }

  async deleteMenu(_id: string, menuId: string): Promise<Restaurant> {
    return await this.restaurantModel
      .findByIdAndUpdate(new Types.ObjectId(_id), { $pull: { menus: { _id: new Types.ObjectId(menuId) } } })
      .exec();
  }

  async addMenuOption(_id: string, menuId: string, createMenuOptionsDto: CreateMenuOptionsDto): Promise<Restaurant> {
    const menuOption: CreateMenuOptionsDto = new this.menuOptionModel(createMenuOptionsDto);
    return await this.restaurantModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(_id), 'menus._id': new Types.ObjectId(menuId) },
        { $push: { 'menus.$.options': menuOption } },
        { new: true },
      )
      .exec();
  }

  async updateMenuOption(_id: string, menuId: string, updateMenuOptionDto: UpdateMenuOptionsDto): Promise<Restaurant> {
    return await this.restaurantModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(_id),
          'menus._id': new Types.ObjectId(menuId),
          'menus.options._id': new Types.ObjectId(updateMenuOptionDto._id),
        },
        { $set: { 'menus.$': updateMenuOptionDto } },
      )
      .exec();
  }

  async deleteMenuOption(_id: string, menuId: string, menuOptionId: string): Promise<Restaurant> {
    return await this.restaurantModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(_id), 'menus._id': new Types.ObjectId(menuId) },
        { $pull: { 'menus.$.options': { _id: new Types.ObjectId(menuOptionId) } } },
      )
      .exec();
  }
}
