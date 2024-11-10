import { create } from "zustand";

interface UserPreferenceState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const useUserPreferenceStore = create<UserPreferenceState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));

export default useUserPreferenceStore;
