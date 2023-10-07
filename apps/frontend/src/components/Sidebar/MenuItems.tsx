import {
  FolderIcon,
  HomeIcon,
  PlusIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';
import { RoleType } from '../../app/util/type/RoleType';

const MenuItems = [
  {
    label: 'Apps',
    icon: <HomeIcon strokeWidth={3} className="w-5 h-5" />,
    path: '/apps',
    children: [
      {
        label: 'All Apps',
        icon: <FolderIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/apps/all',
      },
      {
        label: 'Create App',
        icon: <PlusIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/apps/create-app',
      },
    ],
  },
  {
    label: 'Users',
    icon: <UserGroupIcon strokeWidth={3} className="w-5 h-5" />,
    path: '/users',
    role: RoleType.ADMIN,
    children: [
      {
        label: 'All Users',
        icon: <UserGroupIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/users/all',
      },
      {
        label: 'Create User',
        icon: <UserPlusIcon strokeWidth={3} className="w-5 h-5" />,
        path: '/users/create',
      },
    ],
  },
];
export default MenuItems;
