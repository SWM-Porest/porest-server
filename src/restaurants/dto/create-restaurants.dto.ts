import { IsNotEmpty } from 'class-validator';
import { Date, Types } from 'mongoose';
import { Menu, MenuOption, Name, Item } from '../schemas/restaurants.schema';

export class CreateRestaurantsDto {
  _id: Types.ObjectId;

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
  _id: Types.ObjectId;

  @IsNotEmpty()
  name: string;

  en_name: string;

  category: string;

  menutype: string;

  description: string;

  img: object;

  @IsNotEmpty()
  price: number;

  isSoldOut: boolean;

  menuOptions: MenuOption[];

  created_at: Date;

  updated_at: Date;
}

export class CreateMenuOptionsDto {
  _id: Types.ObjectId;

  @IsNotEmpty()
  name: Name;

  created_at: Date;

  updated_at: Date;

  isSoldOut: boolean;

  maxSelect: number;

  items: Item[];
}
