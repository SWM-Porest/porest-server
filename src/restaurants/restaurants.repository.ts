import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Restaurant } from "./schemas/restaurants.schema";
import { Model } from "mongoose";
import { CreateRestaurantsDto } from "./dto/create-restaurants.dto";

@Injectable()
export class RestaurantRepository {
    constructor(@InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>) {}

    async createRestaurant(createRestaurantsDto: CreateRestaurantsDto): Promise<Restaurant> {
        const { name } = createRestaurantsDto
        if (this.restaurantModel.exists({name})) {
            throw new HttpException('Duplicate', HttpStatus.CONFLICT);
        }
        return this.restaurantModel.create(createRestaurantsDto);
    }
    
    async findOneRestaurant(_id: string) {
        return await this.restaurantModel.findById(_id).exec();
    }
}