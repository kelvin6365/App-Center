import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import PermissionEnum from './enum/permission.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserPermission } from '../user/entities/user.permission.entity';

const PermissionGuard = (permission: PermissionEnum): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return user?.permissions
        .map((p: UserPermission) => p.permissionId)
        .includes(permission);
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
