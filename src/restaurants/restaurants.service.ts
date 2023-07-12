import { Injectable } from '@nestjs/common';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantsService {
    constructor(@InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>) {}

    create(CreateRestaurantsDto: CreateRestaurantsDto) {
        const createdRestaurant = new this.restaurantModel(CreateRestaurantsDto);
        return createdRestaurant.save();
    }

    findAll() {
        return 'Find All Restaurants';
    }

    findOne(id: number) {
        return `Find Restaurants with id${id}`;
    }

    update(id: number, updateRestaurantsDto: UpdateRestaurantsDto) {
        return `Update Restaurant with id${id}`;
    }

    remove(id: number) {
        return `Remove Restaurant with id${id}`;
    }
}
