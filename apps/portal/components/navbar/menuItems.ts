import { NavItemWithOptionalChildren } from '@/types';

export const MenuItems: NavItemWithOptionalChildren[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    href: '/console',
  },
  {
    title: 'Apps',
    icon: 'layers',
    href: '/apps',
    items: [
      {
        title: 'All Apps',
        icon: 'layers',
        href: '/all',
      },
    ],
  },
  {
    title: 'Users',
    icon: 'users',
    href: '/users',
    items: [
      {
        title: 'All Users',
        icon: 'users',
        href: '/all',
      },
    ],
  },
];
