import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type RestaurantsDocument = HydratedDocument<Restaurant>;

@Schema()
export class menuoption {
  @Prop()
  name: string;

  @Prop()
  en_name: string;

  @Prop()
  content: string;

  @Prop()
  price: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop()
  status: number;
}

@Schema()
export class Menu {
  @Prop({ required: true })
  name: string;

  @Prop()
  en_name: string;

  @Prop()
  category: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop()
  status: number;

  @Prop()
  options: menuoption;
}
export const MenusSchema = SchemaFactory.createForClass(Menu);

@Schema()
export class Restaurant {
  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  en_name: string;

  @Prop()
  phone_number: string;

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
