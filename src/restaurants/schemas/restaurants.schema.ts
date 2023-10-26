import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date, HydratedDocument, Types } from 'mongoose';

export type RestaurantsDocument = HydratedDocument<Restaurant>;

export type Image = {
  filename: string;
  path: string;
  type: string;
};

export interface Language {
  ko: string;
  en: string;
}

export interface Name {
  language: Language;
}

export interface Content {
  language: Language;
}
export type Item = {
  name: Name;
  price: number;
};
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
  isRequired: boolean;

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
  @ApiProperty({ description: '매장 ID' })
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @ApiProperty({ description: '매장 이름' })
  @Prop({ required: true, index: true })
  name: string;

  @ApiProperty({ description: '매장 영문 이름' })
  @Prop()
  en_name: string;

  @ApiProperty({ description: '매장 카테고리' })
  @Prop()
  category: string[];

  @ApiProperty({ description: '매장 소개' })
  @Prop()
  intro: string;

  @ApiProperty({ description: '매장 공지' })
  @Prop()
  notice: string;

  @ApiProperty({ description: '매장 전화번호' })
  @Prop()
  phone_number: string;

  @ApiProperty({ description: '매장 배너 이미지' })
  @Prop({ type: [Object] })
  banner_images: Image[];

  @ApiProperty({ description: '매장 주소' })
  @Prop()
  address: string;

  @ApiProperty({ description: '매장 생성일' })
  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @ApiProperty({ description: '매장 수정일' })
  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @ApiProperty({ description: '매장 상태' })
  @Prop()
  status: number;

  @ApiProperty({ description: '매장 메뉴' })
  @Prop()
  menus: Menu[];
}

export const RestaurantsSchema = SchemaFactory.createForClass(Restaurant);
RestaurantsSchema.index({ name: 1 }, { unique: true });
