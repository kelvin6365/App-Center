import { RoleType } from "../types/RoleType";

interface PathConfig {
  path: string;
  allowedRoles: RoleType[];
}

const pathRoleMapping: PathConfig[] = [
  {
    path: "/apps",
    allowedRoles: [
      RoleType.USER,
      RoleType.ADMIN,
      RoleType.CLIENT,
      RoleType.SALESPERSON,
    ],
  },
  { path: "/team", allowedRoles: [RoleType.ADMIN] },
  // Add more path configurations as needed
];

export function getAllowedRolesForPath(path: string): RoleType[] {
  const config = pathRoleMapping.find(
    (item) =>
      path.startsWith(item.path) ||
      new RegExp(`^${item.path.replace("*", ".*")}$`).test(path)
  );
  return config ? config.allowedRoles : [];
}

export function isRoleAllowedForPath(role: RoleType, path: string): boolean {
  const allowedRoles = getAllowedRolesForPath(path);
  return allowedRoles.includes(role);
}
