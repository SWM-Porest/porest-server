import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { BasicAuthStrategy } from './basic-auth.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [BasicAuthStrategy],
})
export class AuthModule {}
