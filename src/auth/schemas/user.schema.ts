import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ unique: true })
  email: string;

  @Prop()
  nickname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
