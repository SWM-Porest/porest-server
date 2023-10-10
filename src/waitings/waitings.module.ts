import { Module } from '@nestjs/common';
import { WaitingsService } from './waitings.service';
import { WaitingsController } from './waitings.controller';
import { WaitingsRepository } from './waitings.repository';
import { WaitingSchema } from './schemas/waiting.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/auth/user.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Waitings', schema: WaitingSchema }]), AuthModule, RestaurantsModule],
  controllers: [WaitingsController],
  providers: [WaitingsService, WaitingsRepository, AuthService, UsersService, RestaurantsService],
})
export class WaitingsModule {}
