import { getDictionary, getLocaleOnServer } from '@/i18n/server';
import React from 'react';
import I18N from './i18n';

export type II18NServerProps = {
  children: React.ReactNode;
};

const I18NServer = async ({ children }: II18NServerProps) => {
  const locale = getLocaleOnServer();
  const dictionary = await getDictionary(locale);

  return <I18N {...{ locale, dictionary }}>{children}</I18N>;
};

export default I18NServer;
