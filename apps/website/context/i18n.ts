import { createContext } from 'use-context-selector';
import type { Locale } from '@/i18n';

type II18NContext = {
  locale: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18n: Record<string, any>;
  setLocaleOnClient: (locale: Locale, reloadPage?: boolean) => void;
  //   setI8N: (i18n: Record<string, string>) => void,
};

const I18NContext = createContext<II18NContext>({
  locale: 'en',
  i18n: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLocaleOnClient: (lang: Locale, reloadPage?: boolean) => {},
  //   setI8N: () => {},
});

export default I18NContext;
