import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { AuthGuard } from '@nestjs/passport';
import { Restaurant } from './schemas/restaurants.schema';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @UseGuards(AuthGuard('basic'))
  @Post()
  async createRestaurant(@Body() createRestaurantsDto: CreateRestaurantsDto) {
    return await this.restaurantService.createRestaurant(createRestaurantsDto);
  }

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  async findOneRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return await this.restaurantService.findOne(id);
  }

  @UseGuards(AuthGuard('basic'))
  @Patch(':id')
  async updateRestaurant(@Param('id') id: string, @Body() updateRestaurantsDto: UpdateRestaurantsDto) {
    return this.restaurantService.update(id, updateRestaurantsDto);
  }

  @UseGuards(AuthGuard('basic'))
  @Post(':id/menus/')
  async addMenu(@Param('id') id: string, @Body() createMenusDto: CreateMenusDto) {
    return await this.restaurantService.addMenu(id, createMenusDto);
  }

  @UseGuards(AuthGuard('basic'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
