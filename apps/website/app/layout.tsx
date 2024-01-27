import I18NServer from '@/components/i18n-server';
import './global.css';
import { StyledComponentsRegistry } from './registry';
import { getLocaleOnServer } from '@/i18n/server';
import './global.css';
import Header from '@/app/_components/header';

export const metadata = {
  title: 'Welcome to demo2',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocaleOnServer();
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body>
        <StyledComponentsRegistry>
          <I18NServer>
            <Header />
            {children}
          </I18NServer>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
