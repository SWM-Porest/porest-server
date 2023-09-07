import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mSchema, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  _id: Types.ObjectId;

  @Prop({ required: true })
  restaurant_id: string;

  @Prop({ required: true })
  restaurant_name: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  menus: mSchema.Types.Mixed;

  @Prop({ required: true, default: 1 })
  status: number;

  @Prop({ required: true })
  table_id: number;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.set('timestamps', { createdAt: 'created_at', updatedAt: 'updated_at' });

export enum OrderStatus {
  ORDERED = 1,
  COOKING = 2,
  COOKED = 3,
  SERVED = 4,
  PAYED = 5,
}
