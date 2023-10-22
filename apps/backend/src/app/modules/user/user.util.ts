import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import AppsPermission from '../permission/enum/apps.permission.enum';
import { RoleType } from '../role/enum/role.type.enum';

export class UserUtil {
  checkUserAppPermissions(
    user: CurrentUserDTO,
    appId: string,
    permission: AppsPermission
  ) {
    if (!user.roles.find((userRole) => userRole.role.type === RoleType.ADMIN)) {
      const userPermissions = user.permissions;
      //get all view permissions
      const viewPermissions = userPermissions.filter(
        (userPermission) => userPermission.permission.id === permission
      );
      if (
        !viewPermissions
          .map((viewPermission) => viewPermission.refId)
          .includes(appId)
      ) {
        throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
      }
    }
  }
}
