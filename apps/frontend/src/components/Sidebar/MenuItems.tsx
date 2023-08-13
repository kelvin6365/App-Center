import { FolderIcon, HomeIcon, PlusIcon } from '@heroicons/react/24/solid';

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
        path: '/create-app',
      },
    ],
  },
];
export default MenuItems;
