'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {},
  },
  'zh-Hans': {
    translation: {},
  },
};

i18n
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: undefined,
    fallbackLng: 'en',
    // debug: true,
    resources,
  });

export const changeLanguage = i18n.changeLanguage;
export default i18n;
