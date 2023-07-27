import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @UseGuards(AuthGuard('basic'))
  @Post()
  async createRestaurant(@Body() createRestaurantsDto: CreateRestaurantsDto) {
    return await this.restaurantService.createRestaurant(createRestaurantsDto);
  }

  @Get()
  async findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  async ViewRestaurant(@Param('id') id: string) {
    return await this.restaurantService.findOne(id);
  }

  @UseGuards(AuthGuard('basic'))
  @Patch(':id')
  async updateRestaurant(@Param('id') id: string, @Body() updateRestaurantsDto: UpdateRestaurantsDto) {
    return this.restaurantService.update(id, updateRestaurantsDto);
  }

  @UseGuards(AuthGuard('basic'))
  @Post(':id/menu/')
  async addMenu(@Param('id') id: string, @Body() createMenusDto: CreateMenusDto) {
    return await this.restaurantService.addMenu(id, createMenusDto);
  }

  @UseGuards(AuthGuard('basic'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
