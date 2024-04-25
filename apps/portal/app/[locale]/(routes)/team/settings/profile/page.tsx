'use client';
import { Separator } from '@app-center/shadcn/ui';
import React from 'react';
import ProfileForm from './_components/profile-form';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
