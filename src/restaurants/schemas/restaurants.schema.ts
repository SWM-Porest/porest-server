import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';

export type RestaurantsDocument = HydratedDocument<Restaurant>;

export interface Image {
  filename: string;
  path: string;
  type: string;
}
export interface Language {
  kr: string;
  en: string;
}

export interface Name {
  language: Language;
}

export interface Content {
  language: Language;
}
export interface Item {
  name: Name;
  price: number;
}
@Schema()
export class MenuOption {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ type: Object, required: true })
  name: Name;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop()
  isSoldOut: boolean;

  @Prop()
  maxSelect: number;

  @Prop({ type: [Object] })
  items: Item[];
}
export const MenuOptionsSchema = SchemaFactory.createForClass(MenuOption);
@Schema()
export class Menu {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  en_name: string;

  @Prop()
  category: string;

  @Prop()
  menutype: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  img: Image;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop()
  isSoldOut: boolean;

  @Prop()
  isRequired: boolean;

  @Prop({ type: [Object] })
  menuOptions: MenuOption[];
}
export const MenusSchema = SchemaFactory.createForClass(Menu);

@Schema()
export class Restaurant {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  en_name: string;

  @Prop()
  category: string[];

  @Prop()
  intro: string;

  @Prop()
  notice: string;

  @Prop()
  phone_number: string;

  @Prop({ type: [Object] })
  banner_images: Image[];

  @Prop()
  address: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop()
  status: number;

  @Prop()
  menus: Menu[];
}

export const RestaurantsSchema = SchemaFactory.createForClass(Restaurant);
RestaurantsSchema.index({ name: 1 }, { unique: true });
