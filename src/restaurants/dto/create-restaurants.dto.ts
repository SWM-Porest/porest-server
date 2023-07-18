import { IsNotEmpty } from 'class-validator';
import { Date } from 'mongoose';
import { Menu, menuoption } from '../schemas/restaurants.schema';

export class CreateRestaurantsDto {
  @IsNotEmpty()
  name: string;

  en_name: string;

  phone_number: string;

  address: string;

  created_at: Date;

  updated_at: Date;

  status: number;

  menus: Menu[];
}

export class CreateMenusDto {
  @IsNotEmpty()
  name: string;

  en_name: string;

  content: string;

  @IsNotEmpty()
  price: number;

  created_at: Date;

  updated_at: Date;

  status: number;

  options: menuoption;
}

export class CreateMenuOptionsDto {
  @IsNotEmpty()
  name: string;

  en_name: string;

  content: string;

  price: string;

  created_at: Date;

  updated_at: Date;

  status: number;
}
