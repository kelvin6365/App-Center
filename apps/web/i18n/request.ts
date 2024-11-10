import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";
export const locales = ["en", "zh-HK"];
export default getRequestConfig(async (): Promise<any> => {
  let locale = await getUserLocale();
  if (!locales.includes(locale)) {
    locale = "en";
  }
  return {
    locale,
    messages: {
      ...(await import(`../locales/${locale}/common.json`)).default,
      ...(await import(`../locales/${locale}/account.json`)).default,
      ...(await import(`../locales/${locale}/apps.json`)).default,
      ...(await import(`../locales/${locale}/dashboard.json`)).default,
      ...(await import(`../locales/${locale}/install.json`)).default,
      ...(await import(`../locales/${locale}/onboarding.json`)).default,
      ...(await import(`../locales/${locale}/team.json`)).default,
    },
  };
}) as ReturnType<typeof getRequestConfig>;
