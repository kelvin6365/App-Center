import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { StateCreator } from 'zustand';
import { PortalUserProfile, Tenant } from '../type/PortalUserProfile';

export type AppSlice = {
  isLoggedIn: boolean;
  profile: PortalUserProfile | null;
  availableTenants: Tenant[];
  selectedTenant: Tenant | null;

  setLoggedIn: (payload: any) => void;
  setLogout: () => void;
  setProfile: (payload: PortalUserProfile | null) => void;
  setAvailableTenants: (payload: Tenant[]) => void;
  setTenant: (payload: Tenant | null) => void;
};

const createAppSlice: StateCreator<AppSlice, [], []> = (set) => ({
  isLoggedIn: false,
  profile: null,
  availableTenants: [],
  selectedTenant: null,
  setLoggedIn: (payload: any) =>
    set(() => {
      const expires = new Date(payload.accessTokenExpires);
      Cookies.set('API_TOKEN', payload.accessToken, {
        expires: expires,
      });
      Cookies.set('API_TOKEN_EXPIRES', dayjs(expires).format(), {
        expires: expires,
      });
      Cookies.set('API_REFRESH_TOKEN', payload.refreshToken, {
        expires: expires,
      });
      return { isLoggedIn: true, profile: null };
    }),
  setLogout: () =>
    set(() => {
      Cookies.remove('API_TOKEN');
      Cookies.remove('API_REFRESH_TOKEN');
      Cookies.remove('API_TOKEN_EXPIRES');
      return { isLoggedIn: false };
    }),
  setProfile: (payload: PortalUserProfile | null) =>
    set((state) => ({ ...state, profile: payload })),

  setAvailableTenants: (payload: Tenant[]) =>
    set((state) => ({ ...state, availableTenants: payload })),

  setTenant: (payload: Tenant | null) =>
    set((state) => ({ ...state, selectedTenant: payload })),
});

export default createAppSlice;
