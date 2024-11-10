import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RoleType } from '../role/enum/role.type.enum';
import { UserRole } from '../user/entities/user.role.entity';
import { CurrentUserDTO } from './dto/current.user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const RoleGuard = (roleType: RoleType): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user: CurrentUserDTO = request.user;
      const userRoles: UserRole[] = user.roles ?? [];
      const tenantId = request.headers['x-tenant-id'];
      return userRoles
        .filter((ur) => ur.tenantId === tenantId)
        .map((ur: UserRole) => ur.role.type as string)
        .includes(roleType);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
