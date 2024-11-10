import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUserDTO } from './dto/current.user.dto';
import { UserRole } from '../user/entities/user.role.entity';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log(roles, request.user);
    if (!request.headers['x-tenant-id']) {
      return false;
    }
    const userData: CurrentUserDTO = request.user;
    const userRoles: UserRole[] = userData.roles ?? [];

    return roles.some(
      (r) =>
        (
          userRoles
            .filter((ur) => ur.tenantId === request.headers['x-tenant-id'])
            .map((ur) => ur.role.type) as string[]
        ).indexOf(r) != -1,
    );
  }
}
