import { StateCreator } from 'zustand';
import { Setting } from '../type/Setting';
import { CredentialComponent } from '../type/CredentialComponent';
export type SettingSlice = {
  settings: Setting[];
  credentialComponents: CredentialComponent[];
  setSettings: (settings: Setting[]) => void;
  setCredentialComponents: (components: CredentialComponent[]) => void;
};
export const createSettingSlice: StateCreator<SettingSlice, [], []> = (
  set
) => ({
  settings: [],
  credentialComponents: [],
  setSettings: (settings: Setting[]) =>
    set((state) => ({ ...state, settings })),
  setCredentialComponents: (credentialComponents: CredentialComponent[]) =>
    set((state) => ({ ...state, credentialComponents })),
});
