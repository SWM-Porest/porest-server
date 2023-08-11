import { IsNotEmpty } from 'class-validator';
import { Date } from 'mongoose';
import { Menu, Menuoption } from '../schemas/restaurants.schema';

export class CreateRestaurantsDto {
  @IsNotEmpty()
  name: string;

  en_name: string;

  category: string[];

  intro: string;

  notice: string;

  phone_number: string;

  banner_images: object[];

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

  category: string;

  menutype: string;

  description: string;

  img: object;

  price: number;

  created_at: Date;

  updated_at: Date;

  status: number;

  options: Menuoption[];

  get _id(): string {
    return this._id;
  }
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
