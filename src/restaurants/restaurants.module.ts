import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantsSchema } from './schemas/restaurants.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantsSchema}])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService]
})
export class RestaurantsModule {}
