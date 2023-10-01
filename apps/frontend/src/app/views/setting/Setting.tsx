import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import General from './general/General';
import Credentials from './credentials/Credentials';
import { useQuery } from '../../util/util';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
  const navigate = useNavigate();
  const [init, setInit] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const query = useQuery();
  const data = [
    {
      label: 'General',
      value: 1,
      desc: <General />,
    },
    {
      label: 'Notifications',
      value: 2,
      desc: `Coming soon`,
    },
    {
      label: 'Credentials',
      value: 3,
      desc: <Credentials isActive={activeTab === 3} />,
    },
    {
      label: 'Others',
      value: 4,
      desc: `Coming soon`,
    },
    // {
    //   label: 'Svelte',
    //   value: 5,
    //   desc: `We're not always in the position that we want to be at.
    //   We're constantly growing. We're constantly making mistakes. We're
    //   constantly trying to express ourselves and actualize our dreams.`,
    // },
  ];

  const initTab = () => {
    console.log(query.get('tab'));
    if (query.get('tab') !== null) {
      switch (query.get('tab') as string) {
        default:
        case 'general':
          setActiveTab(1);
          break;
        case 'notification':
          setActiveTab(2);
          break;
        case 'credentials':
          setActiveTab(3);
          break;
        case 'others':
          setActiveTab(4);
          break;
      }
      navigate('/setting', { replace: true });
    }
    setInit(true);
  };
  useEffect(() => {
    initTab();
  }, []);

  return (
    <div>
      <DefaultBreadcrumb
        pageName="Settings"
        icon={<Cog6ToothIcon className="w-5 h-5" />}
        paths={['/setting']}
      />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          Settings
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Configurations for the system.
        </Typography>
      </div>
      {init && (
        <Tabs value={activeTab}>
          <TabsHeader
            indicatorProps={{
              className: 'bg-blue-500 shadow-none',
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={activeTab === value ? 'text-white' : ''}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      )}
    </div>
  );
};

export default Setting;
