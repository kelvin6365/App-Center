'use client';

import type { FC } from 'react';
import React, { useEffect } from 'react';
import { changeLanguage } from '@/i18n/i18next-config';
import I18NContext from '@/context/i18n';
import type { Locale } from '@/i18n';
import { setLocaleOnClient } from '@/i18n/client';

export type II18nProps = {
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: Record<string, any>;
  children: React.ReactNode;
};
const I18n: FC<II18nProps> = ({ locale, dictionary, children }) => {
  useEffect(() => {
    changeLanguage(locale);
  }, [locale]);

  return (
    <I18NContext.Provider
      value={{
        locale,
        i18n: dictionary,
        setLocaleOnClient,
      }}
    >
      {children}
    </I18NContext.Provider>
  );
};
export default React.memo(I18n);
