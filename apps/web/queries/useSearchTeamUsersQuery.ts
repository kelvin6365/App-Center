import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

const useSearchTeamUsersQuery = ({
  selectedTeam,
  page,
  limit,
  searchQuery = "",
  sorting = [],
}: {
  selectedTeam: { id: string; name: string } | null;
  page: number;
  limit: number;
  searchQuery?: string;
  sorting?: {
    key: string;
    value: "ASC" | "DESC";
  }[];
}) => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: [selectedTeam, `teamUsers`, page, limit, searchQuery, sorting],
    queryFn: async () => {
      if (!selectedTeam) {
        return;
      }
      const { data } = await API.user.searchUsers(selectedTeam.id, {
        page,
        limit,
        query: JSON.stringify({
          query: searchQuery,
          // filters: [
          //   {
          //     key: 'tenantId',
          //     values: [selectedTeam.id],
          //   },
          // ],
          sorting,
        }),
      });
      return data.data;
    },
    enabled: !!selectedTeam,
  });

  return {
    users: data?.items || [],
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
    isRefetching,
  };
};

export default useSearchTeamUsersQuery;
