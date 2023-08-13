import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
} from '@material-tailwind/react';
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
  PowerIcon,
} from '@heroicons/react/24/solid';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import { useState } from 'react';
type Props = {};

const Setting = (props: Props) => {
  const [activeTab, setActiveTab] = useState(1);
  const data = [
    {
      label: 'General',
      value: 1,
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: 'Teams',
      value: 2,
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: 'Keys Configurations',
      value: 3,
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
    {
      label: 'Others',
      value: 4,
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
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
