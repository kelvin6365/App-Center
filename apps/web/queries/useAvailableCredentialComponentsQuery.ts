import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { Tenant } from "../types/PortalUserProfile";

const useAvailableCredentialComponentsQuery = ({
  selectedTeam,
}: {
  selectedTeam: Tenant | null;
}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [selectedTeam, "availableCredentialComponents"],
    queryFn: async () => {
      const { data } = await API.credential.getAllCredentialComponents();
      return data.data;
    },
    enabled: !!selectedTeam,
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
