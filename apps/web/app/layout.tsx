import Loading from "@/components/loading";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import SessionProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import "@repo/ui/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Suspense } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "App Center",
  description: "",
};
export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = await getLocale();
  const messages = await getMessages({ locale });
  return (
    <html className="h-screen" lang={locale} suppressHydrationWarning>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className={`h-full ${inter.className}`}>
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
