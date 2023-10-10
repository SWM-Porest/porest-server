import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Waiting {
  _id: Types.ObjectId;

  @Prop()
  user_id: string;

  @Prop()
  restaurant_id: string;

  @Prop()
  restaurant_name: string;

  @Prop({ required: true, default: 1 })
  status: number;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const WaitingSchema = SchemaFactory.createForClass(Waiting);

WaitingSchema.index({ status: 1 });
WaitingSchema.set('timestamps', { createdAt: 'created_at', updatedAt: 'updated_at' });

export enum WaitingStatus {
  WAITING = 1,
  CALL = 2,
  SEATED = 3,
  CANCEL = 4,
}
