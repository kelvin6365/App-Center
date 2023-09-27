import { Typography } from '@material-tailwind/react';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';

const InviteUser = () => {
  return (
    <div>
      <DefaultBreadcrumb
        pageName={'User Management.Invite User'}
        paths={['/users']}
      />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          Invite User
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Invite a new user to the portal.
        </Typography>
      </div>
      <div className="pt-4"></div>
    </div>
  );
};

export default InviteUser;
