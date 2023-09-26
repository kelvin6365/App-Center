import loadable from '@loadable/component';
import { Navigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import App from '../app';
import dashboardRoute from './dashboard/dashboardRoute';
import settingRoute from './setting/settingRoute';
import userManagementRoute from './userManagement/userManagementRoute';
import { Suspense } from 'react';
const Guard = loadable(() => import('../routes/Guard'), {
  fallback: <Loading />,
});
const Login = loadable(() => import('../views/login/Login'), {
  fallback: <Loading />,
});
const Register = loadable(() => import('../views/register/Register'), {
  fallback: <Loading />,
});
const Install = loadable(() => import('../views/install/Install'), {
  fallback: <Loading />,
});
const NotFound = loadable(() => import('../views/404/404'), {
  fallback: <Loading />,
});

const route = () => {
  return [
    {
      path: '/',
      element: (
        <Suspense fallback={<Loading />}>
          <Guard auth={true}>
            <App />
          </Guard>
        </Suspense>
      ),
      children: [
        ...dashboardRoute(),
        ...userManagementRoute(),
        ...settingRoute(),
        {
          path: '*',
          element: <Navigate to={`/apps`} replace />,
        },
      ],
    },
    {
      path: '/install/:id',
      element: (
        <Suspense fallback={<Loading />}>
          <Install />
        </Suspense>
      ),
    },
    {
      path: '/login',
      element: (
        <Suspense fallback={<Loading />}>
          <Guard auth={false}>
            <Login />
          </Guard>
        </Suspense>
      ),
    },
    {
      path: '/register',
      element: (
        <Suspense fallback={<Loading />}>
          <Guard auth={false}>
            <Register />
          </Guard>
        </Suspense>
      ),
    },
    {
      path: '/404',
      element: <NotFound />,
    },
    {
      path: '*',
      element: <Navigate to={`/`} replace />,
    },
  ];
};
export default route;
