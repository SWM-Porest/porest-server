import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { Types } from 'mongoose';
import { RestaurantRepository } from './restaurants.repository';

@Injectable()
export class RestaurantsService {
    constructor(private readonly restaurantRepository: RestaurantRepository) {}
    
    async create(createRestaurantsDto: CreateRestaurantsDto) {
        return this.restaurantRepository.createRestaurant(createRestaurantsDto);
    }

    findAll() {
        return 'Find All Restaurants';
    }

    async findOne(_id: string) {
        if (Types.ObjectId.isValid(_id)) {
            const findRestaurant = this.restaurantRepository.findOneRestaurant(_id);
            if (findRestaurant) {
                return findRestaurant
            } else{
                throw new NotFoundException(null);
            }
        } else {
            throw new NotFoundException(null);
        }
        
         
    }

    update(_id: string, updateRestaurantsDto: UpdateRestaurantsDto) {
        return `Update Restaurant with id${_id}`;
    }

    remove(_id: string) {
        return `Remove Restaurant with id${_id}`;
    }
}
