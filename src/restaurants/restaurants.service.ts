import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateMenusDto, UpdateRestaurantsDto } from './dto/update-restaurants.dto';
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
      const findRestaurant = await this.restaurantRepository.findOneRestaurant(_id);
      if (findRestaurant) {
        return findRestaurant;
      } else {
        throw new NotFoundException(`Not exist ${_id}`);
      }
    } else {
      throw new NotFoundException('Invalid ID');
    }
  }

  update(_id: string, updateRestaurantsDto: UpdateRestaurantsDto) {
    return `Update Restaurant with id${_id}`;
  }

  async addMenu(_id: string, createMenusDto: CreateMenusDto) {
    const restaurant = await this.findOne(_id);
    if (restaurant) {
      return await this.restaurantRepository.addMenu(_id, createMenusDto);
    } else {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }
  }

  remove(_id: string) {
    return `Remove Restaurant with id${_id}`;
  }
}
