'use client';
import React from 'react';
import CustomBreadcrumb from '@/components/breadcrumb/breadcrumb';
import PageTitle from '@/components/content/pageTitle';
import { useTranslations } from 'next-intl';
import { SidebarNav } from './_components/sidebar-nav';
import { Separator } from '@app-center/shadcn/ui';
type SettingsLayoutProps = {
  children: React.ReactNode;
};

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/team/settings/profile',
  },
  {
    title: 'Credentials',
    href: '/team/settings/credentials',
  },
];
const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const t = useTranslations('Settings');
  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t('Team'),
            href: '/team',
          },
          {
            label: t('Settings'),
            href: '/team/settings',
          },
        ]}
      />
      <PageTitle title={t('Settings')} description={t('Your team settings')} />
      <Separator className="mt-2 mb-4" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
