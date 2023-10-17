import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Table {
  @Prop({ type: Types.ObjectId, required: true })
  restaurant_id: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], required: false })
  order_ids: Types.ObjectId[];

  @Prop({ required: true })
  name: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const TableSchema = SchemaFactory.createForClass(Table);
TableSchema.index({ _id: 1 }, { unique: true });
