import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { StateCreator } from 'zustand';

export type AppSlice = {
  isLoggedIn: boolean;
  setLoggedIn: (payload: any) => void;
  setLogout: () => void;
};

const createAppSlice: StateCreator<AppSlice, [], []> = (set) => ({
  isLoggedIn: false,
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
      return { isLoggedIn: true };
    }),
  setLogout: () =>
    set(() => {
      Cookies.remove('API_TOKEN');
      Cookies.remove('API_REFRESH_TOKEN');
      Cookies.remove('API_TOKEN_EXPIRES');
      return { isLoggedIn: false };
    }),
});

export default createAppSlice;
