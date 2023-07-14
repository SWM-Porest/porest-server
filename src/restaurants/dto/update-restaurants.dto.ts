import { PartialType } from '@nestjs/swagger';
import {
  CreateMenuOptionsDto,
  CreateMenusDto,
  CreateRestaurantsDto,
} from './create-restaurants.dto';

export class UpdateRestaurantsDto extends PartialType(CreateRestaurantsDto) {}

export class UpdateMenusDto extends PartialType(CreateMenusDto) {}

export class UpdateMenuOptionsDto extends PartialType(CreateMenuOptionsDto) {}
