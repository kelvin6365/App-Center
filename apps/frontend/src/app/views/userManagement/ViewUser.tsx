import {
  Avatar,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import API from '../../util/api';
import isUuid from '../../util/util';
import { PortalUserProfile } from '../../util/type/PortalUserProfile';

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<PortalUserProfile | null>(null);

  const [activeTab, setActiveTab] = useState(1);
  const data = [
    {
      label: 'General',
      value: 1,
      desc: <div />,
    },
    {
      label: 'Coming soon',
      value: 2,
      desc: `Coming soon`,
    },
    {
      label: 'Coming soon',
      value: 3,
      desc: `Coming soon`,
    },
    {
      label: 'Coming soon',
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

  //get user
  const getUser = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const res = await API.user.getUser(id);
      const { data } = res.data;
      setUser(data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  }, [id]);

  useEffect(() => {
    if (isUuid(id ?? '')) {
      getUser();
    } else {
      navigate('../users', { replace: true });
    }
  }, [getUser, id, navigate]);

  return (
    <div>
      <DefaultBreadcrumb
        pageName={'User Management.All Users.' + user?.profile?.name ?? '-'}
        paths={['/users', '/users']}
      />
      <div className="flex items-center gap-4 pb-2 my-2">
        <Avatar
          src={
            user?.profile?.avatar ??
            'https://ui-avatars.com/api/?name=' + (user?.profile?.name ?? '')
          }
          alt="avatar"
          size="lg"
        />
        <div>
          <Typography variant="h4" color="blue-gray">
            {user?.profile?.name ?? '-'}
          </Typography>
          <Typography color="gray" className="font-normal">
            ID: {user?.id ?? '-'}
          </Typography>
        </div>
      </div>
      <div className="my-2">
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
    </div>
  );
};

export default ViewUser;
