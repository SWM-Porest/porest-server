import { IsNotEmpty } from 'class-validator';
import { Date } from 'mongoose';
import { menuoption } from '../schemas/restaurants.schema';

export class CreateRestaurantsDto {
  @IsNotEmpty()
  name: string;

  en_name: string;

  categroy: string[];

  intro: string;

  notice: string;

  phone_number: string;

  banner_image_urls: string[];

  address: string;

  created_at: Date;

  updated_at: Date;

  status: number;
}

export class CreateMenusDto {
  @IsNotEmpty()
  name: string;

  en_name: string;

  category: string;

  menutype: string;

  description: string;

  img: string;

  price: number;

  created_at: Date;

  updated_at: Date;

  status: number;

  options: menuoption[];
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
