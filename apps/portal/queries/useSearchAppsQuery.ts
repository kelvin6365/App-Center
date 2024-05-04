import { useQuery } from '@tanstack/react-query';
import API from '@/services/api';

const useSearchAppsQuery = ({
  selectedTeam,
  page,
  limit,
  searchQuery,
}: {
  selectedTeam: { id: string; name: string } | null;
  page: number;
  limit: number;
  searchQuery?: string;
}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [selectedTeam, `allApps`, page, limit, searchQuery],
    queryFn: async () => {
      if (!selectedTeam) {
        return;
      }
      const { data } = await API.app.searchApp({
        page,
        limit,
        query: JSON.stringify({
          query: searchQuery ?? '',
          // filters: [
          //   {
          //     key: 'tenantId',
          //     values: [selectedTeam.id],
          //   },
          // ],
        }),
      });
      return data.data;
    },
    enabled: !!selectedTeam,
  });

  return {
    apps: data?.items || [],
    meta: data?.meta || {
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      itemCount: 0,
    },
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useSearchAppsQuery;
