import {
  FolderIcon,
  HomeIcon,
  PlusIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';

const MenuItems = [
  {
    label: 'Dashboard',
    icon: <HomeIcon strokeWidth={3} className="w-5 h-5" />,
    path: '/',
    children: [
      {
        label: 'All Apps',
        icon: <FolderIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/apps',
      },
      {
        label: 'Create App',
        icon: <PlusIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/apps/create-app',
      },
    ],
  },
  {
    label: 'User Management',
    icon: <UserGroupIcon strokeWidth={3} className="w-5 h-5" />,
    path: '/',
    children: [
      {
        label: 'All Users',
        icon: <UserGroupIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/users',
      },
      {
        label: 'Invite User',
        icon: <UserPlusIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/users/invite',
      },
    ],
  },
];
export default MenuItems;
