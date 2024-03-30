import { useQuery } from '@tanstack/react-query';
import API from '@/services/api';

const useSearchAppVersionsQuery = ({
  appId,
  page,
  limit,
  searchQuery = '',
  tags = [],
  sorting = [],
}: {
  appId: string;
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
    queryKey: [appId, 'appVersions', page, limit, tags, searchQuery, sorting],
    queryFn: async () => {
      const { data } = await API.app.searchAppVersions(appId, {
        page,
        limit,
        query: JSON.stringify({
          query: searchQuery,
          filters: [
            ...(tags.length > 0
              ? [
                  {
                    key: 'tags.id',
                    values: tags,
                  },
                ]
              : []),
          ],
          sorting,
        }),
      });
      return data.data;
    },
    refetchInterval: 10000,
    enabled: !!appId,
  });

  return {
    appVersions: data?.items || [],
    meta: data?.meta || {
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      itemCount: 0,
    },
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  };
};

export default useSearchAppVersionsQuery;
