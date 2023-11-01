import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY, userLevel } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const level = this.reflector.get<userLevel[]>(ROLES_KEY, context.getHandler());
    if (!level) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    return level.some((role) => user?.userlevel >= role);
  }
}
