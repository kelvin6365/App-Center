import { Navigate } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';
import loadable from '@loadable/component';
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

const userManagementRoute = () => {
  return [
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
  ];
};
export default userManagementRoute;
