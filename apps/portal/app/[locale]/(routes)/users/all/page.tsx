'use client';
import CustomBreadcrumb from '@/components/breadcrumb/breadcrumb';
import PageTitle from '@/components/content/pageTitle';
import { useTranslations } from 'next-intl';
import React from 'react';

const AllUsers = () => {
  const t = useTranslations('Users');
  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t('Users'),
            href: '/users',
          },
          {
            label: t('All Users'),
            href: '/users/all',
          },
        ]}
      />
      <PageTitle
        title={t('All Users')}
        description={t('All users can be found here')}
      />
      AllUsers
    </div>
  );
};

export default AllUsers;
