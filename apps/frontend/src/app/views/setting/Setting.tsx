import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from '@material-tailwind/react';
import { useState } from 'react';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import General from './general/General';
import Credentials from './credentials/Credentials';
type Props = {};

const Setting = (props: Props) => {
  const [activeTab, setActiveTab] = useState(1);
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
      desc: <Credentials />,
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
  return (
    <div>
      <DefaultBreadcrumb
        pageName="Settings"
        icon={<Cog6ToothIcon className="w-5 h-5" />}
      />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          Settings
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Configurations for the system.
        </Typography>
      </div>
      <Tabs value={1}>
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
    </div>
  );
};

export default Setting;
