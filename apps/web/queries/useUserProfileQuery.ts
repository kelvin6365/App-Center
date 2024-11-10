import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

const useUserProfileQuery = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await API.user.profile();
      return data.data;
    },
  });

  return {
    userProfile: data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useUserProfileQuery;
