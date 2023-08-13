import Loading from '../../../components/Loading/Loading';
import loadable from '@loadable/component';
const Setting = loadable(() => import('../../views/setting/Setting'), {
  fallback: <Loading />,
});

const settingRoute = () => {
  return [
    {
      path: '/setting',
      element: <Setting />,
    },
  ];
};
export default settingRoute;
