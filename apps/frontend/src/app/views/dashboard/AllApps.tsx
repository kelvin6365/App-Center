import { Typography } from '@material-tailwind/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import AppCard from '../../../components/Card/AppCard';
import TextInput from '../../../components/Input/TextInput';
import { DefaultPagination } from '../../../components/Pagination/Pagination';
import API from '../../util/api';
import { App } from '../../util/type/App';
import { Meta } from '../../util/type/Meta';
import { BiSearchAlt2 } from 'react-icons/bi';
import Loading from '../../../components/Loading/Loading';
type SearchFormInputs = {
  supperSearch: string;
};

const AllApps = () => {
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const location = useLocation();
  const { supperSearch, page } = location.state || {};

  const [apps, setApps] = useState<App[]>([]);

  const [totalPages, setTotalPages] = useState(0);

  //isLoading
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SearchFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      supperSearch: supperSearch ?? undefined,
    },
  });

  const searchApps = useCallback(async () => {
    try {
      if (!isLoading) {
        setIsLoading(true);
      }
      //search api
      const res = await API.app.searchApp({
        page: page,
        limit: itemsPerPage,
        query: JSON.stringify({
          query: supperSearch ?? '',
        }),
      });
      const { data }: { data: { items: App[]; meta: Meta } } = res.data;
      const { items, meta }: { items: App[]; meta: Meta } = data;
      setApps(items);
      setTotalPages(meta.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  }, [page, supperSearch]);

  const onSubmit = async (values: SearchFormInputs) => {
    console.log(values);

    navigate('/apps', {
      state: { page: 1, supperSearch: values.supperSearch },
    });
  };

  useEffect(() => {
    reset({
      supperSearch: supperSearch,
    });

    if (location.state) {
      searchApps();
    } else {
      navigate('/apps', {
        state: { page: 1, supperSearch: '' },
        replace: true,
      });
    }
  }, [searchApps, navigate, location.state, reset, supperSearch]);

  return (
    <>
      <DefaultBreadcrumb pageName="Dashboard.All Apps" />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          App Apps
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          All apps can be found here.
        </Typography>
      </div>
      <div className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register('supperSearch', {})}
            placeholder="Quick Search..."
            errors={errors}
            loading={isSubmitting}
            icon={<BiSearchAlt2 />}
          />
        </form>
      </div>
      {isLoading && (
        <div className="py-12">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-8 py-2 md:grid-cols-4 lg:grid-cols-5">
          {apps.map(({ name, description, iconFileURL, id }, i) => {
            return (
              <NavLink key={i} to={'/apps/' + id}>
                <AppCard
                  name={name}
                  description={description}
                  icon={iconFileURL}
                />
              </NavLink>
            );
          })}
        </div>
      )}
      <div className="my-2 bg-gray-300 h-[1px] opacity-40" />
      <div className="py-2 ml-auto">
        <DefaultPagination
          activePage={page}
          totalPages={totalPages}
          onPageChange={(latestPage: number) => {
            console.log(latestPage);
            navigate('/apps', {
              state: { page: latestPage, supperSearch: supperSearch },
            });
          }}
        />
      </div>
    </>
  );
};

export default AllApps;
