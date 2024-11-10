import useAvailableTenantsQuery from '@/queries/useAvailableTenantsQuery';
import { create } from 'zustand';

interface AvailableTenantsState {
  availableTenants: {
    id: string;
    name: string;
  }[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

const useAvailableTenantsStore = create<AvailableTenantsState>((set) => {
  const { availableTenants, isLoading, isError, error, refetch } =
    useAvailableTenantsQuery();

  return {
    availableTenants,
    isLoading,
    isError,
    error,
    refetch,
  };
});

export default useAvailableTenantsStore;
