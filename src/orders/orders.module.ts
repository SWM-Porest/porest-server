import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/orders.schema';
import { OrdersRepository } from './orders.repository';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/auth/user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Orders', schema: OrderSchema }]), AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, AuthService, UsersService],
})
export class OrdersModule {}
