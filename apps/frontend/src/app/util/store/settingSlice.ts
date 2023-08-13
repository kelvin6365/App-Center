import { StateCreator } from 'zustand';
import { Setting } from '../type/Setting';
export type SettingSlice = {
  settings: Setting[];
  setSettings: (settings: Setting[]) => void;
};
export const createSettingSlice: StateCreator<SettingSlice, [], []> = (
  set
) => ({
  settings: [],
  setSettings: (settings: Setting[]) =>
    set((state) => ({ ...state, settings })),
});
