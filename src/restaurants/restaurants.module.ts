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
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/auth/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantsSchema },
      { name: Menu.name, schema: MenusSchema },
      { name: MenuOption.name, schema: MenuOptionsSchema },
    ]),
    AuthModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantRepository, ImageUploadService, AuthService, UsersService],
  exports: [RestaurantsService, RestaurantRepository, ImageUploadService],
})
export class RestaurantsModule {}
