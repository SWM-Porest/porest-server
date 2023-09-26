import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mSchema, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export class StatusUpdatedAt {
  [key: number]: Date;
}

class Keys {
  auth: string;

  p256dh: string;
}

export class PushSubscription {
  endpoint: string;

  keys: Keys;

  expirationTime: number | null;
}

export class OrderMenudetail {
  menu_name: string;
  price: number;
  quantity: number;
  img: string;
  // 옵션 추가해야됨.
}

export class OrderMenu {
  [key: string]: OrderMenudetail;
}

@Schema()
export class Order {
  _id: Types.ObjectId;

  @Prop({ required: true })
  restaurant_id: string;

  @Prop({ required: true })
  restaurant_name: string;

  @Prop({ required: true })
  restaurant_address: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  menus: OrderMenu;

  @Prop({ required: true, default: 1 })
  status: number;

  @Prop({
    required: true,
    default: { '1': new Date() },
  })
  status_updated_at: StatusUpdatedAt;

  @Prop({ required: true })
  table_id: number;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  token: PushSubscription;
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
