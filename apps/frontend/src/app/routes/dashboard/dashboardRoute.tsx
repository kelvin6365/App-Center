import Loading from '../../../components/Loading/Loading';
import loadable from '@loadable/component';
const AllApps = loadable(() => import('../../views/dashboard/AllApps'), {
  fallback: <Loading />,
});

const ViewApp = loadable(() => import('../../views/dashboard/ViewApp'), {
  fallback: <Loading />,
});

const CreateApp = loadable(() => import('../../views/dashboard/CreateApp'), {
  fallback: <Loading />,
});

const dashboardRoute = () => {
  return [
    {
      path: '/apps',
      element: <AllApps />,
    },
    {
      path: '/apps/:appId',
      element: <ViewApp />,
    },
    {
      path: '/apps/create-app',
      element: <CreateApp />,
    },
  ];
};
export default dashboardRoute;
