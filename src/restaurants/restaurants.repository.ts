import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, Restaurant } from './schemas/restaurants.schema';
import { Model, Types } from 'mongoose';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateMenusDto, UpdateRestaurantsDto } from './dto/update-restaurants.dto';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>,
    @InjectModel(Menu.name) private readonly menuModel: Model<Menu>,
  ) {}

  async createRestaurant(createRestaurantsDto: CreateRestaurantsDto): Promise<Restaurant> {
    createRestaurantsDto.menus = createRestaurantsDto.menus.map((menu) => {
      if (!menu._id) {
        return new this.menuModel(menu);
      } else {
        return menu;
      }
    });
    return await this.restaurantModel.create(createRestaurantsDto);
  }

  async isExistRestaurant(name: string): Promise<boolean> {
    return (await this.restaurantModel.exists({ name })) ? true : false;
  }
  async updateRestaurant(_id: string, updateRestaurantsDto: UpdateRestaurantsDto): Promise<Restaurant> {
    updateRestaurantsDto.menus = await Promise.all(
      updateRestaurantsDto.menus.map((menu) => {
        if (!menu._id) {
          return new this.menuModel(menu);
        } else {
          return menu;
        }
      }),
    );

    return await this.restaurantModel.findByIdAndUpdate(_id, updateRestaurantsDto, { new: true });
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantModel.find().exec();
  }

  async findOneRestaurant(_id: string): Promise<Restaurant> {
    return await this.restaurantModel.findById(_id).exec();
  }

  async addMenu(_id: string, createMenusDto: CreateMenusDto): Promise<Restaurant> {
    const menu: CreateMenusDto = new this.menuModel(createMenusDto);
    return await this.restaurantModel.findByIdAndUpdate(_id, { $push: { menus: menu } }, { new: true });
  }

  async updateMenu(_id: string, updateMenusDto: UpdateMenusDto): Promise<Restaurant> {
    if (updateMenusDto._id === undefined) {
      const menu: CreateMenusDto = new this.menuModel(updateMenusDto);
      return await this.restaurantModel.findByIdAndUpdate(_id, { $push: { menus: menu } }, { new: true });
    } else {
      return await this.restaurantModel
        .findOneAndUpdate(
          { _id, 'menus._id': new Types.ObjectId(updateMenusDto._id) },
          { $set: { 'menus.$': updateMenusDto } },
        )
        .exec();
    }
  }

  async deleteMenu(_id: string, menuId: string): Promise<Restaurant> {
    return await this.restaurantModel
      .findByIdAndUpdate(_id, { $pull: { menus: { _id: new Types.ObjectId(menuId) } } })
      .exec();
  }
}
