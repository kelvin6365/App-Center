import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppException } from '../response/app.exception';
import { ResponseCode } from '../response/response.code';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];
    const user = request.user;
    if (!tenantId) {
      throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    }

    //check the tenant is valid with the current user
    const tenant = user.tenants.find((t) => t.tenant.id === tenantId);
    if (!tenant) {
      throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    }

    return tenantId;
  },
);
