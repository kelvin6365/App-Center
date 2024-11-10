import { NavItemWithOptionalChildren } from "@/types";
import { RoleType } from "@/types/RoleType";

export const MenuItems: NavItemWithOptionalChildren[] = [
  {
    title: "Dashboard",
    icon: "dashboard",
    href: "/console",
    roles: [],
  },
  {
    title: "Apps",
    icon: "layers",
    href: "/apps",
    roles: [],
    items: [
      {
        title: "All Apps",
        icon: "layers",
        href: "/all",
        roles: [],
      },
    ],
  },
  {
    title: "Team",
    icon: "users",
    href: "/team",
    roles: [RoleType.ADMIN],
    items: [
      {
        title: "All Members",
        icon: "users",
        href: "/members",
        roles: [RoleType.ADMIN],
      },
      {
        title: "Settings",
        icon: "users",
        href: "/settings",
        roles: [RoleType.ADMIN],
      },
    ],
  },
];
