import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Schema()
export class Waiting {
  _id: Types.ObjectId;

  @ApiProperty({
    example: '60b9b0b9e6b3b3a0e4b9e0a0',
    description: '대기하는 유저의 ID',
    required: true,
  })
  @Prop()
  user_id: string;

  @ApiProperty({
    example: '60b9b0b9e6b3b3a0e4b9e0a0',
    description: '대기하는 레스토랑의 ID',
    required: true,
  })
  @Prop()
  restaurant_id: string;

  @ApiProperty({
    example: '대기하는 레스토랑의 이름',
    description: '대기하는 레스토랑의 이름',
  })
  @Prop()
  restaurant_name: string;

  @ApiProperty({
    enum: ['WAITING', 'CALL', 'SEATED', 'CANCEL'],
    example: 1,
    description: '현재 대기의 상태',
    required: true,
  })
  @Prop({ required: true, default: 1 })
  status: number;

  @ApiProperty({
    example: 1,
    description: '대기하는 인원 수',
    required: true,
  })
  @Prop({ required: true, default: 1 })
  head_count: number;

  @Prop({ required: false })
  canceled_by: string;

  @ApiProperty({
    example: '1900-01-01T00:00:00.000Z',
    description: '생성 시간',
    required: false,
  })
  @Prop()
  created_at: Date;

  @ApiProperty({
    example: '1900-01-01T00:00:00.000Z',
    description: '업데이트 시간',
    required: false,
  })
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
