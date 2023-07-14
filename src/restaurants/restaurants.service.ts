import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateMenusDto,
  CreateRestaurantsDto,
} from './dto/create-restaurants.dto';
import {
  UpdateMenusDto,
  UpdateRestaurantsDto,
} from './dto/update-restaurants.dto';
import { Types } from 'mongoose';
import { RestaurantRepository } from './restaurants.repository';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async createRestaurant(createRestaurantsDto: CreateRestaurantsDto) {
    return this.restaurantRepository.createRestaurant(createRestaurantsDto);
  }

  findAll() {
    return 'Find All Restaurants';
  }

  async findOne(_id: string) {
    if (Types.ObjectId.isValid(_id)) {
      const findRestaurant = this.restaurantRepository.findOneRestaurant(_id);
      if (findRestaurant) {
        return findRestaurant;
      } else {
        throw new NotFoundException('Not Found Restaurant1');
      }
    } else {
      throw new NotFoundException('Not Found Restaurant2');
    }
  }

  update(_id: string, updateRestaurantsDto: UpdateRestaurantsDto) {
    return `Update Restaurant with id${_id}`;
  }

  async addMenu(_id: string, createMenusDto: CreateMenusDto) {
    const restaurant = await this.findOne(_id);
    if (restaurant) {
      const addMenu = await this.restaurantRepository.addMenu(
        _id,
        createMenusDto,
      );
      return addMenu;
    } else {
      throw new NotFoundException('Not Found Restaurant3');
    }
  }

  remove(_id: string) {
    return `Remove Restaurant with id${_id}`;
  }
}
