import { useQuery } from '@tanstack/react-query';
import API from '@/services/api';

const useAvailableTenantsQuery = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['availableTenants'],
    queryFn: async () => {
      const { data } = await API.user.getAvailableTenants();
      return data.data.items;
    },
  });

  return {
    availableTenants: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useAvailableTenantsQuery;
