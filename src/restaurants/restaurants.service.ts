import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { Types } from 'mongoose';
import { RestaurantRepository } from './restaurants.repository';
import { Restaurant } from './schemas/restaurants.schema';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async createRestaurant(createRestaurantsDto: CreateRestaurantsDto) {
    return this.restaurantRepository.createRestaurant(createRestaurantsDto);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.findAll();
  }

  async findOne(_id: string): Promise<Restaurant> {
    if (Types.ObjectId.isValid(_id)) {
      const findRestaurant: Restaurant = await this.restaurantRepository.findOneRestaurant(_id);
      if (findRestaurant) {
        return findRestaurant;
      } else {
        throw new NotFoundException(`Not exist ${_id}`);
      }
    } else {
      throw new NotFoundException('Invalid ID');
    }
  }

  async update(_id: string, updateRestaurantsDto: UpdateRestaurantsDto) {
    return this.restaurantRepository.updateRestaurant(_id, updateRestaurantsDto);
  }

  async addMenu(_id: string, createMenusDto: CreateMenusDto): Promise<Restaurant> {
    const restaurant: Restaurant = await this.findOne(_id);
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
