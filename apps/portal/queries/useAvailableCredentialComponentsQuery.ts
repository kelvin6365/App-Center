import { useQuery } from '@tanstack/react-query';
import API from '@/services/api';

const useAvailableCredentialComponentsQuery = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['availableCredentialComponents'],
    queryFn: async () => {
      const { data } = await API.credential.getAllCredentialComponents();
      return data.data;
    },
  });

  return {
    availableCredentialComponents: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useAvailableCredentialComponentsQuery;
