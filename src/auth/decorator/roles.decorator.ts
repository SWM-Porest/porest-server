import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../schemas/user.schema';

export type userLevel = (typeof UserRole)[keyof typeof UserRole];
export const ROLES_KEY = 'UserLevel';
export const Roles = (...roles: userLevel[]) => SetMetadata(ROLES_KEY, roles);
