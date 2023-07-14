import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantService: RestaurantsService) {}

    @Post()
    create(@Body() CreateRestaurantsDto: CreateRestaurantsDto) {
        return this.restaurantService.create(CreateRestaurantsDto)
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
    update(@Param('id') id: string, @Body() updateRestaurantsDto: UpdateRestaurantsDto) {
        return this.restaurantService.update(id, updateRestaurantsDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.restaurantService.remove(id);
    }
    
    
}
