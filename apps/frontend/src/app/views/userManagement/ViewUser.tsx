import { Typography } from '@material-tailwind/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import API from '../../util/api';
import isUuid from '../../util/util';

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
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
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          {user?.profile?.name ?? '-'}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          ID: {user?.id ?? '-'}
        </Typography>
      </div>
      <div>ViewUser</div>
    </div>
  );
};

export default ViewUser;
