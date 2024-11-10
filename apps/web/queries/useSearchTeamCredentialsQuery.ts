import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { Tenant } from "../types/PortalUserProfile";

const useSearchTeamCredentialsQuery = ({
  selectedTeam,
  page,
  limit,
  searchQuery = "",
  tags = [],
  sorting = [],
}: {
  selectedTeam: Tenant | null;
  page: number;
  limit: number;
  searchQuery?: string;
  tags?: string[];
  sorting?: {
    key: string;
    value: "ASC" | "DESC";
  }[];
}) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: [
      selectedTeam,
      "teamCredentials",
      page,
      limit,
      tags,
      searchQuery,
      sorting,
    ],
    queryFn: async () => {
      const { data } = await API.credential.getAllCredentials();
      return data.data;
    },
    enabled: !!selectedTeam,
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
