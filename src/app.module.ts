import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { WaitingsModule } from './waitings/waitings.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'dev',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
      }),
      isGlobal: true,
      cache: true,
    }),
    RestaurantsModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    OrdersModule,
    WaitingsModule,
    TablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
