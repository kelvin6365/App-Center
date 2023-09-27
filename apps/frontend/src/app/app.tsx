import { useEffect, useState } from 'react';
import Content from '../components/Content/Content';
import Sidebar from '../components/Sidebar/Sidebar';

import { Outlet } from 'react-router-dom';
import PageContent from '../components/Content/PageContent';
import API from './util/api';
import { useAppStore, useBoundStore } from './util/store/store';
import Loading from '../components/Loading/Loading';

export function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isLoggedIn, setProfile] = useAppStore((state: any) => [
    state.isLoggedIn,
    state.setProfile,
  ]);
  const [setSettings, setCredentialComponents] = useBoundStore((state) => [
    state.setSettings,
    state.setCredentialComponents,
  ]);

  const [isLoading, setIsLoading] = useState(true);

  //fetch settings
  const fetchInitData = async () => {
    if (isLoading) {
      setIsLoading(true);
    }
    try {
      const [settingsRes, credentialComponentsRes, profileRes] =
        await Promise.all([
          API.setting.getAllSettings(),
          API.credential.getAllCredentialComponents(),
          API.user.profile(),
        ]);
      console.log('[fetchInitData] Profile');
      setProfile(profileRes.data.data);
      console.log('[fetchInitData] Settings');
      setSettings(settingsRes.data.data.settings);
      console.log('[fetchInitData] CredentialComponents');
      setCredentialComponents(credentialComponentsRes.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  //initialize
  useEffect(() => {
    if (isLoggedIn) {
      fetchInitData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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
