// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from 'react';
import Content from '../components/Content/Content';
import Sidebar from '../components/Sidebar/Sidebar';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageContent from '../components/Content/PageContent';
import { useBoundStore } from './util/store/store';
import API from './util/api';
import { Setting } from './util/type/Setting';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [setSettings] = useBoundStore((state) => [state.setSettings]);
  //fetch settings
  const fetchSettings = async () => {
    try {
      const res = await API.setting.getAllSettings();
      const {
        data: { settings: _ },
      }: {
        data: { settings: Setting[] };
      } = res.data;
      setSettings(_);
    } catch (error) {
      console.error(error);
    }
  };

  //initialize
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (location?.pathname === '/' || location == null) {
      navigate('/apps', { replace: true });
    }
  }, [location, navigate]);

  return (
    <Content>
      <Sidebar />
      <PageContent>
        <Outlet />
      </PageContent>
    </Content>
  );
}

export default App;
