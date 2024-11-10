import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

const useAppQuery = ({ appId, ready }: { appId: string; ready: boolean }) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [appId, "app"],
    queryFn: async () => {
      const { data } = await API.app.getApp(appId);
      return data.data;
    },
    enabled: !!appId && ready,
  });

  return {
    app: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useAppQuery;
