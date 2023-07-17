import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [RestaurantsModule, MongooseModule.forRoot('mongodb://localhost/nest', { dbName: 'dbname' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
