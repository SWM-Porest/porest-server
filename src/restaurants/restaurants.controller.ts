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
import { UpdateMenusDto, UpdateRestaurantsDto } from './dto/update-restaurants.dto';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 10 },
      { name: 'menuImage', maxCount: 100 },
    ]),
  )
  @Patch(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFiles() files: { image?: Express.Multer.File[]; menuImage?: Express.Multer.File[] },
  ): Promise<Restaurant> {
    const updateRestaurantsDto: UpdateRestaurantsDto = JSON.parse(data.updateRestaurantsDto);

    return this.restaurantService.update(id, updateRestaurantsDto, files);
  }

  @UseGuards(AuthGuard('basic'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post(':id/menus')
  async addMenu(@Param('id') id: string, @Body() data: any, @UploadedFiles() files: Express.Multer.File[]) {
    const createMenusDto: CreateMenusDto = JSON.parse(data.createMenusDto);
    return await this.restaurantService.addMenu(id, createMenusDto, files);
  }

  @UseGuards(AuthGuard('basic'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Patch(':id/menus')
  async updateMenu(@Param('id') id: string, @Body() data: any, @UploadedFiles() files: Express.Multer.File[]) {
    const updateMenusDto: UpdateMenusDto = JSON.parse(data.updateMenusDto);
    return await this.restaurantService.updateMenu(id, updateMenusDto, files);
  }

  @UseGuards(AuthGuard('basic'))
  @Delete(':id/menus/:menuId')
  async deleteMenu(@Param('id') id: string, @Param('menuId') menuId: string) {
    return await this.restaurantService.deleteMenu(id, menuId);
  }

  @UseGuards(AuthGuard('basic'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
