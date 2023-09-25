import { Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import UserTable from '../../../components/Table/UserTable';

const AllUsers = () => {
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const [users, setUsers] = useState<[]>([]);

  const [totalPages, setTotalPages] = useState(0);

  const location = useLocation();
  const { supperSearch, page } = location.state || {};

  //isLoading
  const [init, setIsLoading] = useState(true);

  useEffect(() => {
    // reset({
    //   supperSearch: supperSearch,
    // });

    if (location.state) {
      // searchUsers();
      setIsLoading(false);
    } else {
      navigate('/users', {
        state: { page: 1, supperSearch: '' },
        replace: true,
      });
    }
  }, [navigate, location.state, supperSearch]);

  return (
    <>
      <DefaultBreadcrumb
        pageName="User Management.All Users"
        paths={['/users']}
      />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          All Users
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          All users can be found here.
        </Typography>
      </div>
      <div className="pt-4">
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register('supperSearch', {})}
            placeholder="Quick Search..."
            errors={errors}
            loading={isSubmitting}
            icon={<BiSearchAlt2 />}
          />
        </form> */}
      </div>

      <UserTable enableFooter={false} supperSearch={supperSearch} page={page} />
    </>
  );
};

export default AllUsers;
