'use client';
import { useRouter } from 'next/navigation';

const Settings = () => {
  const router = useRouter();
  router.replace('/team/settings/profile');
  return <div></div>;
};

export default Settings;
