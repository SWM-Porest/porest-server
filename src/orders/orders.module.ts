import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/orders.schema';
import { OrdersRepository } from './orders.repository';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../auth/user.service';
import { OrdersGateway } from './orders.gateway';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RestaurantRepository } from '../restaurants/restaurants.repository';
import { ImageUploadService } from 'src/common/uploader/image-upload.service';
import {
  Menu,
  MenuOption,
  MenuOptionsSchema,
  MenusSchema,
  Restaurant,
  RestaurantsSchema,
} from '../restaurants/schemas/restaurants.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Orders', schema: OrderSchema },
      { name: Restaurant.name, schema: RestaurantsSchema },
      { name: Menu.name, schema: MenusSchema },
      { name: MenuOption.name, schema: MenuOptionsSchema },
    ]),
    AuthModule,
    RestaurantsModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    AuthService,
    UsersService,
    OrdersGateway,
    RestaurantsService,
    RestaurantRepository,
    ImageUploadService,
  ],
})
export class OrdersModule {}
