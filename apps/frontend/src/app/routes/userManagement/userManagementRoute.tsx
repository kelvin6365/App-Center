import Loading from '../../../components/Loading/Loading';
import loadable from '@loadable/component';
const AllUsers = loadable(() => import('../../views/userManagement/AllUsers'), {
  fallback: <Loading />,
});
const ViewUser = loadable(() => import('../../views/userManagement/ViewUser'), {
  fallback: <Loading />,
});

const InviteUser = loadable(
  () => import('../../views/userManagement/InviteUser'),
  {
    fallback: <Loading />,
  }
);

const userManagementRoute = () => {
  return [
    {
      path: '/users',
      element: <AllUsers />,
    },
    {
      path: '/users/invite',
      element: <InviteUser />,
    },
    {
      path: '/users/:id',
      element: <ViewUser />,
    },
  ];
};
export default userManagementRoute;
