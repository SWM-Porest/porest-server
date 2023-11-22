import { PartialType } from '@nestjs/swagger';
import { CreateMenuOptionsDto, CreateMenusDto } from './create-restaurants.dto';
import { Image } from '../schemas/restaurants.schema';

export class UpdateRestaurantsDto {
  name: string;
  phone_number: string;
  intro: string;
  address: string;
  banner_images: Image[];
}

export class UpdateMenusDto extends PartialType(CreateMenusDto) {}

export class UpdateMenuOptionsDto extends PartialType(CreateMenuOptionsDto) {}
