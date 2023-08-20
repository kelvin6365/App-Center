import loadable from '@loadable/component';
import { Navigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import App from '../app';
import dashboardRoute from './dashboard/dashboardRoute';
import settingRoute from './setting/settingRoute';
const Login = loadable(() => import('../views/login/Login'), {
  fallback: <Loading />,
});
const Install = loadable(() => import('../views/install/Install'), {
  fallback: <Loading />,
});

const route = () => {
  return [
    {
      path: '/',
      element: <App />,
      children: [
        ...dashboardRoute(),
        ...settingRoute(),
        {
          path: '*',
          element: <Navigate to={`/`} replace />,
        },
      ],
    },
    {
      path: '/install/:id',
      element: <Install />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <Navigate to={`/`} replace />,
    },
  ];
};
export default route;
