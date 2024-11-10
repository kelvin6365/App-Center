import API from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const useAvailablePlansQuery = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['availablePlans'],
    queryFn: async () => {
      const { data } = await API.plan.getAllPlans();
      return data.data;
    },
  });

  return {
    data: data || {
      items: [],
      meta: {},
    },
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useAvailablePlansQuery;
