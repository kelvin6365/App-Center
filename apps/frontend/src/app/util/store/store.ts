import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SettingSlice, createSettingSlice } from './settingSlice';
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
