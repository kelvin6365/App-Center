import { NextIntlClientProvider, useMessages, useLocale } from 'next-intl';
import './globals.css';
import { ToastProvider } from '@/components/providers/toast-provider';
import SessionProvider from '@/components/providers/session-provider';

import { notFound } from 'next/navigation';

export const metadata = {
  title: 'App Center',
  description: '',
};
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = useLocale();
  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  const messages = useMessages();
  return (
    <html className="h-screen" lang={locale} suppressHydrationWarning>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className="h-full">
          <SessionProvider>
            {children}
            <ToastProvider />
          </SessionProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
