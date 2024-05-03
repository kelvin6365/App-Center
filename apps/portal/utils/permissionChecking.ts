import { NavItemWithOptionalChildren } from '@/types';
import PermissionEnum from '@/types/Permission';
import { PortalUserProfile, Role } from '@/types/PortalUserProfile';
import { RoleType } from '@/types/RoleType';

export const checkAllowModifyAppUserPermission = (roles: Role[]) => {
  //Allowed Roles
  // Admin
  return roles.some((role) => {
    return role.type === RoleType.ADMIN;
  });
};

export const checkAllowAppActionPermission = (
  user: PortalUserProfile,
  permissionsRequired: PermissionEnum[]
) => {
  //Check user have permissions
  return permissionsRequired.some((permission) => {
    return user?.roles.some((role) => {
      if (role.type === RoleType.ADMIN) {
        return true;
      }
      return user.permissions.some((_permission) => {
        return _permission.id === permission;
      });
    });
  });
};
export const filterMenuByRoles = (
  menu: NavItemWithOptionalChildren[],
  user: PortalUserProfile,
  tenantId: string
): NavItemWithOptionalChildren[] => {
  const userRoles = user.roles
    .filter((r) => r.tenantId === tenantId)
    .map((role) => role.type);
  const filteredMenu: NavItemWithOptionalChildren[] = [];

  for (const item of menu) {
    const hasRequiredRole =
      item.roles.length === 0 ||
      item.roles.some((role) => userRoles.includes(role));

    const filteredItem: NavItemWithOptionalChildren = { ...item };

    if (item.items) {
      const filteredItems: NavItemWithOptionalChildren[] = item.items.filter(
        (subItem) =>
          subItem.roles.length === 0 ||
          subItem.roles.some((role) => userRoles.includes(role))
      );

      if (filteredItems.length > 0) {
        filteredItem.items = filteredItems;
      } else {
        delete filteredItem.items;
      }
    }

    if (
      hasRequiredRole ||
      (filteredItem.items && filteredItem.items.length > 0)
    ) {
      filteredMenu.push(filteredItem);
    }
  }

  return filteredMenu;
};

export const canAccessPath = (
  path: string,
  menu: NavItemWithOptionalChildren[],
  user: PortalUserProfile,
  tenantId: string
): boolean => {
  const userRoles = user.roles
    .filter((r) => r.tenantId === tenantId)
    .map((role) => role.type);

  for (const item of menu) {
    if (item.href === path) {
      return (
        item.roles.length === 0 ||
        item.roles.some((role) => userRoles.includes(role))
      );
    }

    if (item.items) {
      for (const subItem of item.items) {
        if ((item?.href ?? '') + subItem.href === path) {
          return (
            subItem.roles.length === 0 ||
            subItem.roles.some((role) => userRoles.includes(role))
          );
        }
      }
    }
  }

  return false;
};
