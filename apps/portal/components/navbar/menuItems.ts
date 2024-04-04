import { NavItemWithOptionalChildren } from '@/types';
import { RoleType } from '@/types/RoleType';

export const MenuItems: NavItemWithOptionalChildren[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    href: '/console',
    roles: [],
  },
  {
    title: 'Apps',
    icon: 'layers',
    href: '/apps',
    roles: [],
    items: [
      {
        title: 'All Apps',
        icon: 'layers',
        href: '/all',
        roles: [],
      },
    ],
  },
  {
    title: 'Users',
    icon: 'users',
    href: '/users',
    roles: [RoleType.ADMIN],
    items: [
      {
        title: 'All Users',
        icon: 'users',
        href: '/all',
        roles: [RoleType.ADMIN],
      },
    ],
  },
];
