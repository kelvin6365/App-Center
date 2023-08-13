import { Navigate } from 'react-router-dom';
import dashboardRoute from './dashboard/dashboardRoute';
import App from '../app';
import settingRoute from './setting/settingRoute';
import loadable from '@loadable/component';
import Loading from '../../components/Loading/Loading';
const Login = loadable(() => import('../views/login/Login'), {
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
