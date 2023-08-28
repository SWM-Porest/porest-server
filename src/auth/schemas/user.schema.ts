import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, default: 10 })
  userlevel: number;

  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ unique: true })
  email: string;

  @Prop()
  nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export enum UserRole {
  ADMIN = 100,
  RESTAURANT_MANAGER = 50,
  USER = 10,
  GUEST = 0,
}
