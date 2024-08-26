'use client';
import { Separator } from '@app-center/shadcn/ui';
import React from 'react';
import ProfileForm from './_components/profile-form';
import { useTranslations } from 'next-intl';

const ProfilePage = () => {
  const t = useTranslations('Profile');
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('Profile')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('This is how others will see you on the site')}
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
