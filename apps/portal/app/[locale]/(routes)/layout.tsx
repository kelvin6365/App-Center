'use client';
import Content from '@/components/content/Content';
import PageContent from '@/components/content/PageContent';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const session = useSession();

  if (session.status === 'unauthenticated') {
    router.push('login');
  }

  return (
    <Content>
      Menu
      <PageContent>{children}</PageContent>
    </Content>
  );
};

export default Layout;
