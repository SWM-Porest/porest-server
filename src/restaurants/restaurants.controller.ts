import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Restaurant } from './schemas/restaurants.schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  async findOneRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return await this.restaurantService.findOne(id);
  }

  @UseGuards(AuthGuard('basic'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 10 }]))
  @Post()
  async createRestaurant(@Body() data: any, @UploadedFiles() files: Express.Multer.File[]): Promise<Restaurant> {
    const createRestaurantsDto: CreateRestaurantsDto = JSON.parse(data.createRestaurantsDto);

    return await this.restaurantService.createRestaurant(createRestaurantsDto, files);
  }

  @UseGuards(AuthGuard('basic'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 10 }]))
  @Patch(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Restaurant> {
    const updateRestaurantsDto: UpdateRestaurantsDto = JSON.parse(data.updateRestaurantsDto);

    return this.restaurantService.update(id, updateRestaurantsDto, files);
  }

  @UseGuards(AuthGuard('basic'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post(':id/menus/')
  async addMenu(@Param('id') id: string, @Body() data: any, @UploadedFiles() files: Express.Multer.File[]) {
    const createMenusDto: CreateMenusDto = JSON.parse(data.createMenusDto);
    return await this.restaurantService.addMenu(id, createMenusDto, files);
  }

  @UseGuards(AuthGuard('basic'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
