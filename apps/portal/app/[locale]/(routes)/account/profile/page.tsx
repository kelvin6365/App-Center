'use client';
import React from 'react';
import ProfileForm from './_components/profile-form';
import { useTranslations } from 'next-intl';
import CustomBreadcrumb from '../../../../../components/breadcrumb/breadcrumb';
import PageTitle from '../../../../../components/content/pageTitle';

const AccountProfilePage = () => {
  const t = useTranslations('Account');
  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t('Account'),
            href: '/account',
          },
          {
            label: t('Profile'),
            href: '/account/profile',
          },
        ]}
      />
      <PageTitle title={t('Profile')} description={''} />
      <div className="lg:max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  );
};

export default AccountProfilePage;
