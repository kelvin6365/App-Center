import { Navigate } from 'react-router-dom';
import dashboardRoute from './dashboard/dashboardRoute';
import App from '../app';
import settingRoute from './setting/settingRoute';

const route = () => {
  return [
    {
      // Go to default page
      // If the link missing language, add it back, default en
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
      path: '*',
      element: <Navigate to={`/`} replace />,
    },
  ];
};
export default route;
