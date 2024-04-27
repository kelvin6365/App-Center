import { useQuery } from '@tanstack/react-query';
import API from '@/services/api';

const useSearchTeamCredentialsQuery = ({
  page,
  limit,
  searchQuery = '',
  tags = [],
  sorting = [],
}: {
  page: number;
  limit: number;
  searchQuery?: string;
  tags?: string[];
  sorting?: {
    key: string;
    value: 'ASC' | 'DESC';
  }[];
}) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['teamCredentials', page, limit, tags, searchQuery, sorting],
    queryFn: async () => {
      const { data } = await API.credential.getAllCredentials();
      return data.data;
    },
  });

  return {
    teamCredentials: data || [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  };
};

export default useSearchTeamCredentialsQuery;
