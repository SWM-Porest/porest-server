import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  CreateMenusDto,
  CreateRestaurantsDto,
} from './dto/create-restaurants.dto';
import {
  UpdateMenusDto,
  UpdateRestaurantsDto,
} from './dto/update-restaurants.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Post()
  createRestaurant(@Body() CreateRestaurantsDto: CreateRestaurantsDto) {
    return this.restaurantService.createRestaurant(CreateRestaurantsDto);
  }

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id')
  updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantsDto: UpdateRestaurantsDto,
  ) {
    return this.restaurantService.update(id, updateRestaurantsDto);
  }

  @Post('/addmenu/:id')
  addMenu(@Param('id') id: string, @Body() createMenusDto: CreateMenusDto) {
    return this.restaurantService.addMenu(id, createMenusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
