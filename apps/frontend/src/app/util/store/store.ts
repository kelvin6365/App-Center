import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SettingSlice, createSettingSlice } from './settingSlice';
import createAppSlice, { AppSlice } from './appSlice';
export const useBoundStore = create(
  devtools(
    persist<SettingSlice>(
      (...a) => ({
        ...createSettingSlice(...a),
      }),
      { name: 'setting-store' }
    )
  )
);
export const useAppStore = create(
  devtools(
    persist<AppSlice>(
      (...a) => ({
        ...createAppSlice(...a),
      }),
      { name: 'app-store' }
    )
  )
);
