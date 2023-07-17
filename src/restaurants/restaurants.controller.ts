import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

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

  @Patch(':id')
  async updateRestaurant(@Param('id') id: string, @Body() updateRestaurantsDto: UpdateRestaurantsDto) {
    return this.restaurantService.update(id, updateRestaurantsDto);
  }

  @Post('/menu/:id')
  async addMenu(@Param('id') id: string, @Body() createMenusDto: CreateMenusDto) {
    return await this.restaurantService.addMenu(id, createMenusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
