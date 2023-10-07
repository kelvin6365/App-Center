import loadable from '@loadable/component';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';
import { useAppStore } from '../../util/store/store';
import { AppSlice } from '../../util/store/appSlice';
import { RoleType } from '../../util/type/RoleType';
const AllUsers = loadable(() => import('../../views/userManagement/AllUsers'), {
  fallback: <Loading />,
});
const ViewUser = loadable(() => import('../../views/userManagement/ViewUser'), {
  fallback: <Loading />,
});

const CreateUser = loadable(
  () => import('../../views/userManagement/CreateUser'),
  {
    fallback: <Loading />,
  }
);
const RoleGuard = () => {
  const [profile] = useAppStore((state: AppSlice) => [state.profile]);
  if (!profile?.roles.map((role) => role.type).includes(RoleType.ADMIN)) {
    return <Navigate to="/apps/all" />;
  }
  return <Outlet />;
};
const userManagementRoute = () => {
  return [
    {
      path: '',
      element: <RoleGuard />,
      children: [
        {
          path: '/users/all',
          element: <AllUsers />,
        },
        {
          path: '/users/create',
          element: <CreateUser />,
        },
        {
          path: '/users/:id',
          element: <ViewUser />,
        },
        {
          path: '/users/*',
          element: <Navigate to={'/users/all'} replace={true} />,
        },
      ],
    },
  ];
};
export default userManagementRoute;
