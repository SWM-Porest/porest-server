import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Menu,
  MenusSchema,
  MenuOption,
  MenuOptionsSchema,
  Restaurant,
  RestaurantsSchema,
} from './schemas/restaurants.schema';
import { RestaurantRepository } from './restaurants.repository';
import { ImageUploadService } from 'src/common/uploader/image-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantsSchema },
      { name: Menu.name, schema: MenusSchema },
      { name: MenuOption.name, schema: MenuOptionsSchema },
    ]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantRepository, ImageUploadService],
})
export class RestaurantsModule {}
