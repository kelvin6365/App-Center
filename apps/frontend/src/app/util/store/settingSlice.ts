import { StateCreator } from 'zustand';
import { Setting } from '../type/Setting';
export type SettingSlice = {
  settings: Setting[];
  credentialComponents: any[];
  setSettings: (settings: Setting[]) => void;
  setCredentialComponents: (components: any[]) => void;
};
export const createSettingSlice: StateCreator<SettingSlice, [], []> = (
  set
) => ({
  settings: [],
  credentialComponents: [],
  setSettings: (settings: Setting[]) =>
    set((state) => ({ ...state, settings })),
  setCredentialComponents: (credentialComponents: any[]) =>
    set((state) => ({ ...state, credentialComponents })),
});
