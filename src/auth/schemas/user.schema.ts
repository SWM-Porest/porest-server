import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class User {
  _id: string;

  @Prop({ required: true, default: 10 })
  userlevel: number;

  @Prop({ required: true, unique: true })
  social_id: string;

  @Prop()
  social_login: string;

  @Prop()
  email: string;

  @Prop()
  nickname: string;

  @Prop()
  restaurants_id: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export enum UserRole {
  ADMIN = 100,
  RESTAURANT_MANAGER = 50,
  USER = 10,
  GUEST = 0,
}
