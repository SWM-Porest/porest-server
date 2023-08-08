import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ unique: true })
  email: string;

  @Prop()
  nickname: string;

  @Prop()
  kakao_access_token: string;

  @Prop()
  kakao_refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
