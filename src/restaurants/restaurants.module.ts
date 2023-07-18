import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenusSchema, Restaurant, RestaurantsSchema } from './schemas/restaurants.schema';
import { RestaurantRepository } from './restaurants.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantsSchema },
      { name: Menu.name, schema: MenusSchema },
    ]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantRepository],
})
export class RestaurantsModule {}
