import { useQuery } from '@tanstack/react-query';
import API from '@/services/api';

const useAppVersionTagsQuery = ({ appId }: { appId: string }) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [appId, 'appVersionTags'],
    queryFn: async () => {
      const { data } = await API.app.getAppVersionTags(appId);
      return data.data;
    },
    enabled: !!appId,
  });

  return {
    appVersionTags: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useAppVersionTagsQuery;
