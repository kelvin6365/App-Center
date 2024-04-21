import { useQuery } from '@tanstack/react-query';
import API from '@/services/api';

const useMemberQuery = ({
  userId,
  ready,
}: {
  userId: string;
  ready: boolean;
}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [userId, 'member'],
    queryFn: async () => {
      const { data } = await API.user.getUser(userId);
      return data.data;
    },
    enabled: !!userId && ready,
  });

  return {
    user: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useMemberQuery;
