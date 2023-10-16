import { PartialType } from '@nestjs/swagger';
import { CreateMenuOptionsDto, CreateMenusDto } from './create-restaurants.dto';

export class UpdateRestaurantsDto {
  name: string;
  phone_number: string;
  intro: string;
  address: string;
}

export class UpdateMenusDto extends PartialType(CreateMenusDto) {}

export class UpdateMenuOptionsDto extends PartialType(CreateMenuOptionsDto) {}
