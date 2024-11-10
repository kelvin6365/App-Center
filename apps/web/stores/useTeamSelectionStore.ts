import { create } from 'zustand';

interface TeamSelectionState {
  selectedTeam: { name: string; id: string } | null;
  setSelectedTeam: (team: { name: string; id: string } | null) => void;
}

const useTeamSelectionStore = create<TeamSelectionState>((set) => ({
  selectedTeam: null,
  setSelectedTeam: (team) => set({ selectedTeam: team }),
}));

export default useTeamSelectionStore;
