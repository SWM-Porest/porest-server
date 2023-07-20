import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }
  async validate(msg: IncomingMessage, username: string, password: string): Promise<boolean> {
    if (
      this.configService.get('HTTP_BASIC_USER') === username &&
      this.configService.get('HTTP_BASIC_PASS') === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
