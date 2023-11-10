import { Module } from '@nestjs/common';
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
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

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
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      clusterConfig: {
        nodes: [
          {
            host: process.env.REDIS_HOST_1,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_2,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_3,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_4,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_5,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_6,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_7,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_8,
            port: 6379,
          },
          {
            host: process.env.REDIS_HOST_9,
            port: 6379,
          },
        ],
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
