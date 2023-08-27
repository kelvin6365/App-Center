import { useEffect } from 'react';
import Content from '../components/Content/Content';
import Sidebar from '../components/Sidebar/Sidebar';

import { Outlet } from 'react-router-dom';
import PageContent from '../components/Content/PageContent';
import API from './util/api';
import { useAppStore, useBoundStore } from './util/store/store';
import { Setting } from './util/type/Setting';

export function App() {
  const [isLoggedIn] = useAppStore((state: any) => [state.isLoggedIn]);
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
    if (isLoggedIn) {
      fetchSettings();
    }
  }, []);

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
