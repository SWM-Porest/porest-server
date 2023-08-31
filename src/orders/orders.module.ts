import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/orders.schema';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Orders', schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
