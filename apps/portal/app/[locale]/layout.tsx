import SessionProvider from '@/components/providers/session-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import './globals.css';

import Loading from '@/components/loading';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              <ReactQueryProvider>
                <Suspense fallback={<Loading fullScreen />}>
                  {children}
                </Suspense>
              </ReactQueryProvider>
              <ToastProvider />
            </SessionProvider>
          </ThemeProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
